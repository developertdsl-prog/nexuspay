const AuditLog = require('../models/AuditLog');

/**
 * Non-blocking operational audit trail logger
 */
const auditLogger = (req, res, next) => {
  const startTime = Date.now();
  const originalEnd = res.end.bind(res);

  res.end = (...args) => {
    const durationMs = Date.now() - startTime;
    originalEnd(...args);

    // Filter mutations (POST, PUT, DELETE, PATCH)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      setImmediate(async () => {
        try {
          await AuditLog.create({
            merchantId: req.merchant ? req.merchant.merchantId : 'SYSTEM',
            method: req.method,
            endpoint: req.originalUrl || req.url,
            statusCode: res.statusCode,
            ipAddress: req.ip || req.connection.remoteAddress,
            durationMs,
            payloadSummary: req.body ? JSON.stringify(req.body).slice(0, 300) : ''
          });
        } catch (err) {
          console.error('[AuditLog Error]', err.message);
        }
      });
    }
  };

  next();
};

module.exports = auditLogger;
