const test = require('node:test');
const assert = require('node:assert');
const { calculateTransactionFee } = require('../services/feeCalculator');

test('Fee Calculator: accurately computes ACH fees and discounts for Enterprise tier', () => {
  const result = calculateTransactionFee(1000000, 'ACH', 'ENTERPRISE'); // $10,000.00
  assert.strictEqual(result.rail, 'ACH');
  assert.strictEqual(result.baseFeeCents, 25);
  // ACH basis points = 80, minus 25 for Enterprise = 55 bps
  assert.strictEqual(result.effectiveBps, 55);
  // 1000000 * 55 / 10000 = 5500 cents ($55.00)
  assert.strictEqual(result.variableFeeCents, 5500);
  assert.strictEqual(result.totalFeeCents, 5525);
  assert.strictEqual(result.netAmountCents, 1000000 - 5525);
});

test('Fee Calculator: FedWire flat base fee with low basis points', () => {
  const result = calculateTransactionFee(5000000, 'FEDWIRE', 'STANDARD'); // $50,000.00
  assert.strictEqual(result.baseFeeCents, 1500); // $15.00 wire base
  assert.strictEqual(result.effectiveBps, 15); // 0.15%
  assert.strictEqual(result.variableFeeCents, 750); // $7.50
  assert.strictEqual(result.totalFeeCents, 2250);
});

test('Fee Calculator: throws on unknown payment rail', () => {
  assert.throws(() => {
    calculateTransactionFee(10000, 'BITCOIN_LIGHTNING');
  }, /Invalid payment rail/);
});
