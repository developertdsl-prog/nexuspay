const crypto = require('crypto');
const WebhookDelivery = require('../models/WebhookDelivery');

/**
 * Computes HMAC-SHA256 signature for webhook payload
 */
const generateWebhookSignature = (payload, secret, timestamp = Math.floor(Date.now() / 1000)) => {
  const data = `${timestamp}.${typeof payload === 'string' ? payload : JSON.stringify(payload)}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return `t=${timestamp},v1=${signature}`;
};

/**
 * Verifies inbound webhook signature against secret
 */
const verifyWebhookSignature = (headerString, rawBody, secret, toleranceSec = 300) => {
  if (!headerString) return false;
  const parts = headerString.split(',');
  const timestampPart = parts.find(p => p.startsWith('t='));
  const sigPart = parts.find(p => p.startsWith('v1='));

  if (!timestampPart || !sigPart) return false;

  const timestamp = parseInt(timestampPart.replace('t=', ''), 10);
  const receivedSig = sigPart.replace('v1=', '');

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSec) {
    return false; // Signature expired
  }

  const expectedData = `${timestamp}.${typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(expectedData).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig));
};

/**
 * Simulates dispatching signed webhook event to merchant target endpoint
 */
const dispatchEvent = async (merchantId, targetUrl, eventType, payload, secret) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateWebhookSignature(payload, secret, timestamp);
  const deliveryId = `del_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

  const record = await WebhookDelivery.create({
    deliveryId,
    merchantId,
    eventType,
    targetUrl: targetUrl || 'https://api.merchant.com/webhooks/nexuspay',
    signature,
    payload,
    responseStatus: 200,
    success: true
  });

  return record;
};

module.exports = {
  generateWebhookSignature,
  verifyWebhookSignature,
  dispatchEvent
};
