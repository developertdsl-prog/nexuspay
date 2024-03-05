const test = require('node:test');
const assert = require('node:assert');
const { getLock, setLock, clearLock } = require('../services/idempotencyService');

test('Idempotency Service: registers and clears transaction lock', () => {
  const key = 'test_idem_lock_123';
  setLock(key, { status: 'COMPLETED', payloadId: 'txn_999' });

  const record = getLock(key);
  assert.ok(record);
  assert.strictEqual(record.status, 'COMPLETED');
  assert.strictEqual(record.payloadId, 'txn_999');

  clearLock(key);
  assert.strictEqual(getLock(key), undefined);
});
