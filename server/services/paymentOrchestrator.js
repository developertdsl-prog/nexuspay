const crypto = require('crypto');
const { PAYMENT_RAILS } = require('../config/paymentRails');
const { calculateTransactionFee } = require('./feeCalculator');

// State transition validation matrix
const VALID_TRANSITIONS = {
  CREATED: ['RESERVED', 'PROCESSING', 'CANCELLED'],
  RESERVED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SUCCEEDED', 'IN_ESCROW', 'FAILED'],
  SUCCEEDED: [], // Terminal
  IN_ESCROW: ['SUCCEEDED'],
  FAILED: ['PROCESSING'], // Allows retry
  CANCELLED: [] // Terminal
};

/**
 * Validates state machine transition
 */
const validateStateTransition = (currentStatus, targetStatus) => {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new Error(`Illegal state transition from ${currentStatus} to ${targetStatus}`);
  }
  return true;
};

/**
 * Simulates clearing through underlying banking rail networks
 */
const executeRailClearing = async (intent) => {
  const rail = PAYMENT_RAILS[intent.rail];
  if (!rail) throw new Error(`Unknown rail: ${intent.rail}`);

  if (intent.amountCents > rail.maxAmountCents) {
    throw new Error(`Transaction amount ${intent.amountCents} exceeds maximum rail limit of ${rail.maxAmountCents}`);
  }

  // Generate deterministic banking network reference
  const railReference = `REF-${rail.code}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  return {
    success: true,
    railReference,
    clearedAt: new Date(),
    settlementDays: rail.settlementDays
  };
};

module.exports = {
  VALID_TRANSITIONS,
  validateStateTransition,
  executeRailClearing
};
