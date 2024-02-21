const test = require('node:test');
const assert = require('node:assert');
const { PAYMENT_RAILS } = require('../config/paymentRails');

test('Payment Rails Config: verifies supported rail currencies and limits', () => {
  assert.ok(PAYMENT_RAILS.ACH);
  assert.ok(PAYMENT_RAILS.FEDWIRE);
  assert.ok(PAYMENT_RAILS.SEPA_CREDIT);
  assert.ok(PAYMENT_RAILS.CARD);
  assert.ok(PAYMENT_RAILS.RTP);

  assert.strictEqual(PAYMENT_RAILS.ACH.supportsEscrow, true);
  assert.strictEqual(PAYMENT_RAILS.CARD.supportsEscrow, false);
  assert.strictEqual(PAYMENT_RAILS.RTP.settlementDays, 0);
});
