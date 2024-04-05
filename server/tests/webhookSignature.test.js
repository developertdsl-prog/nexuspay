const test = require('node:test');
const assert = require('node:assert');
const {
  generateWebhookSignature,
  verifyWebhookSignature
} = require('../services/webhookDispatcher');

test('Webhook Dispatcher: generates and cryptographically validates HMAC-SHA256 signature', () => {
  const secret = 'whsec_test_secret_key_12345';
  const payload = { event: 'payment.succeeded', intentId: 'pi_8892', amountCents: 10000 };
  const timestamp = Math.floor(Date.now() / 1000);

  const signatureHeader = generateWebhookSignature(payload, secret, timestamp);
  assert.match(signatureHeader, /^t=\d+,v1=[0-9a-f]{64}$/);

  // Verification succeeds
  const isValid = verifyWebhookSignature(signatureHeader, payload, secret);
  assert.strictEqual(isValid, true);
});

test('Webhook Dispatcher: rejects tampered webhook payload', () => {
  const secret = 'whsec_test_secret_key_12345';
  const payload = { event: 'payment.succeeded', amountCents: 10000 };
  const timestamp = Math.floor(Date.now() / 1000);

  const signatureHeader = generateWebhookSignature(payload, secret, timestamp);
  const tamperedPayload = { event: 'payment.succeeded', amountCents: 9999999 };

  const isValid = verifyWebhookSignature(signatureHeader, tamperedPayload, secret);
  assert.strictEqual(isValid, false);
});
