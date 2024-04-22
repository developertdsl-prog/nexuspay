const test = require('node:test');
const assert = require('node:assert');
const { calculateTransactionFee } = require('../services/feeCalculator');
const { validateStateTransition, executeRailClearing } = require('../services/paymentOrchestrator');
const { generateWebhookSignature, verifyWebhookSignature } = require('../services/webhookDispatcher');

test('E2E Lifecycle: Complete B2B Intent Creation, Multi-Rail Clearing, and Webhook Signing', async () => {
  // Step 1: Merchant creates payment intent
  const amountCents = 2500000; // $25,000.00
  const rail = 'FEDWIRE';
  const feeCalc = calculateTransactionFee(amountCents, rail, 'ENTERPRISE');

  assert.strictEqual(feeCalc.baseFeeCents, 1500);
  assert.ok(feeCalc.netAmountCents > 0);

  // Step 2: Validate intent state machine transitions
  let currentStatus = 'CREATED';
  assert.strictEqual(validateStateTransition(currentStatus, 'PROCESSING'), true);
  currentStatus = 'PROCESSING';

  // Step 3: Clearing execution through banking network
  const clearing = await executeRailClearing({ rail, amountCents });
  assert.strictEqual(clearing.success, true);
  assert.ok(clearing.railReference.includes('REF-FEDWIRE'));

  assert.strictEqual(validateStateTransition(currentStatus, 'SUCCEEDED'), true);
  currentStatus = 'SUCCEEDED';

  // Step 4: Dispatch signed webhook notification
  const secret = 'whsec_e2e_test_key_9918';
  const eventPayload = {
    event: 'payment.succeeded',
    railReference: clearing.railReference,
    amountCents,
    status: currentStatus
  };

  const header = generateWebhookSignature(eventPayload, secret);
  const verified = verifyWebhookSignature(header, eventPayload, secret);
  assert.strictEqual(verified, true);
});
