const crypto = require('crypto');

/**
 * Validates Escrow status transitions
 */
const ESCROW_TRANSITIONS = {
  HELD: ['RELEASED', 'DISPUTED', 'REFUNDED'],
  DISPUTED: ['RELEASED', 'REFUNDED'],
  RELEASED: [],
  REFUNDED: []
};

const validateEscrowTransition = (currentStatus, targetStatus) => {
  const allowed = ESCROW_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new Error(`Cannot transition escrow hold from ${currentStatus} to ${targetStatus}`);
  }
  return true;
};

const createEscrowReference = () => {
  return `ESC-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

module.exports = {
  ESCROW_TRANSITIONS,
  validateEscrowTransition,
  createEscrowReference
};
