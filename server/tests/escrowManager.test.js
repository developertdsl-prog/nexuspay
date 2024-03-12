const test = require('node:test');
const assert = require('node:assert');
const { validateEscrowTransition, createEscrowReference } = require('../services/escrowManager');

test('Escrow Manager: validates escrow status transitions', () => {
  assert.strictEqual(validateEscrowTransition('HELD', 'RELEASED'), true);
  assert.strictEqual(validateEscrowTransition('HELD', 'DISPUTED'), true);
  assert.strictEqual(validateEscrowTransition('DISPUTED', 'RELEASED'), true);
  assert.strictEqual(validateEscrowTransition('DISPUTED', 'REFUNDED'), true);

  // Once released, terminal state cannot be disputed
  assert.throws(() => {
    validateEscrowTransition('RELEASED', 'DISPUTED');
  }, /Cannot transition escrow hold/);
});

test('Escrow Manager: generates formatted escrow reference', () => {
  const ref = createEscrowReference();
  assert.match(ref, /^ESC-\d+-[0-9A-F]+$/);
});
