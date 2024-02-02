const test = require('node:test');
const assert = require('node:assert');
const { validateStateTransition, executeRailClearing } = require('../services/paymentOrchestrator');

test('Payment Orchestrator: enforces valid intent state machine sequence', () => {
  // Allowed transitions
  assert.strictEqual(validateStateTransition('CREATED', 'PROCESSING'), true);
  assert.strictEqual(validateStateTransition('PROCESSING', 'SUCCEEDED'), true);
  assert.strictEqual(validateStateTransition('PROCESSING', 'IN_ESCROW'), true);

  // Illegal transitions
  assert.throws(() => {
    validateStateTransition('SUCCEEDED', 'PROCESSING');
  }, /Illegal state transition/);

  assert.throws(() => {
    validateStateTransition('CREATED', 'SUCCEEDED');
  }, /Illegal state transition/);
});

test('Payment Orchestrator: executes rail clearing and generates reference', async () => {
  const intent = {
    rail: 'RTP',
    amountCents: 500000, // $5,000.00
    currency: 'USD'
  };

  const clearing = await executeRailClearing(intent);
  assert.strictEqual(clearing.success, true);
  assert.match(clearing.railReference, /^REF-RTP-\d+-[0-9A-F]+$/);
  assert.strictEqual(clearing.settlementDays, 0);
});

test('Payment Orchestrator: rejects payment intent exceeding rail ceiling limit', async () => {
  const overlimitIntent = {
    rail: 'CARD',
    amountCents: 50000000 // $500,000.00 exceeds Card rail limit
  };

  await assert.rejects(async () => {
    await executeRailClearing(overlimitIntent);
  }, /exceeds maximum rail limit/);
});
