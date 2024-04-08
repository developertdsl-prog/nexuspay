const WebhookDelivery = require('../models/WebhookDelivery');
const { dispatchEvent } = require('../services/webhookDispatcher');

// GET /api/webhooks/deliveries
const listDeliveries = async (req, res, next) => {
  try {
    const logs = await WebhookDelivery.find({ merchantId: req.merchant.merchantId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/webhooks/test-ping
const sendTestPing = async (req, res, next) => {
  try {
    const { targetUrl } = req.body;
    const delivery = await dispatchEvent(
      req.merchant.merchantId,
      targetUrl || req.merchant.webhookUrl,
      'payment.created',
      {
        test: true,
        pingId: `ping_${Date.now()}`,
        message: 'NexusPay automated webhook verification test packet.'
      },
      req.merchant.webhookSecret
    );

    res.json({
      success: true,
      message: 'Test ping dispatched with HMAC-SHA256 signature.',
      delivery
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listDeliveries,
  sendTestPing
};
