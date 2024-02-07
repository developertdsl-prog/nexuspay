const rateStore = new Map();

/**
 * Token bucket rate limiter preventing brute-force or API exhaustion
 */
const rateLimiter = (options = { windowMs: 60000, max: 120 }) => {
  return (req, res, next) => {
    const identifier = req.header('X-API-Key') || req.ip;
    const now = Date.now();

    const record = rateStore.get(identifier) || { count: 0, resetAt: now + options.windowMs };

    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + options.windowMs;
    } else {
      record.count += 1;
    }

    rateStore.set(identifier, record);

    res.setHeader('X-RateLimit-Limit', options.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

    if (record.count > options.max) {
      return res.status(429).json({
        success: false,
        error: 'TooManyRequests',
        message: 'Rate limit exceeded. Please back off before re-issuing transactions.'
      });
    }

    next();
  };
};

module.exports = rateLimiter;
