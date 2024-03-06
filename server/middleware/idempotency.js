// In-memory atomic cache with sliding TTL for financial idempotency keys
const idempotencyStore = new Map();

/**
 * Enforces financial idempotency via Idempotency-Key header.
 * Prevents duplicate transactions and caches original responses.
 */
const idempotency = (req, res, next) => {
  if (req.method !== 'POST') return next();

  const key = req.header('Idempotency-Key');
  if (!key) return next();

  const cacheKey = `${req.merchant ? req.merchant.merchantId : 'anon'}:${key}`;
  const existing = idempotencyStore.get(cacheKey);

  if (existing) {
    // If request is currently processing in another concurrent connection
    if (existing.status === 'PROCESSING') {
      return res.status(409).json({
        success: false,
        error: 'ConcurrentRequestConflict',
        message: 'A request with this Idempotency-Key is currently being executed. Please retry shortly.'
      });
    }

    // Return exact cached response payload
    return res.status(existing.statusCode).json(existing.body);
  }

  // Register in-flight processing lock
  idempotencyStore.set(cacheKey, {
    status: 'PROCESSING',
    timestamp: Date.now()
  });

  // Intercept json response to save cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    idempotencyStore.set(cacheKey, {
      status: 'COMPLETED',
      statusCode: res.statusCode,
      body,
      timestamp: Date.now()
    });

    // Cleanup memory after 1 hour TTL
    setTimeout(() => {
      idempotencyStore.delete(cacheKey);
    }, 60 * 60 * 1000);

    return originalJson(body);
  };

  next();
};

module.exports = idempotency;
