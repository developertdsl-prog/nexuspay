const Merchant = require('../models/Merchant');

/**
 * Middleware: Validates X-API-Key and X-Merchant-ID header tokens
 */
const authApiKey = async (req, res, next) => {
  try {
    const apiKey = req.header('X-API-Key') || req.query.apiKey;
    const merchantId = req.header('X-Merchant-ID');

    // Bypass in test environment if explicit mock headers supplied
    if (process.env.NODE_ENV === 'test' && req.headers['x-bypass-auth'] === 'true') {
      req.merchant = {
        _id: 'mock_merchant_test_id',
        merchantId: 'merch_test_123',
        businessName: 'Mock Enterprise Inc',
        tier: 'ENTERPRISE',
        active: true
      };
      return next();
    }

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'AuthenticationError',
        message: 'Missing required API credential: X-API-Key header is required.'
      });
    }

    const query = { apiKey };
    if (merchantId) query.merchantId = merchantId;

    const merchant = await Merchant.findOne(query);
    if (!merchant) {
      return res.status(401).json({
        success: false,
        error: 'InvalidCredentials',
        message: 'Provided API Key does not match any active merchant profile.'
      });
    }

    if (!merchant.active) {
      return res.status(403).json({
        success: false,
        error: 'AccountSuspended',
        message: 'Merchant account is currently suspended from processing transactions.'
      });
    }

    req.merchant = merchant;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authApiKey;
