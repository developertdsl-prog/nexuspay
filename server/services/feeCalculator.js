const { PAYMENT_RAILS } = require('../config/paymentRails');

/**
 * Calculates payment transaction fees based on selected rail and merchant tier
 */
const calculateTransactionFee = (amountCents, railKey, merchantTier = 'STANDARD') => {
  const rail = PAYMENT_RAILS[railKey];
  if (!rail) {
    throw new Error(`Invalid payment rail specified: ${railKey}`);
  }

  // Tier basis points discount
  let tierDiscountBps = 0;
  if (merchantTier === 'GROWTH') tierDiscountBps = 10;
  if (merchantTier === 'ENTERPRISE') tierDiscountBps = 25;

  const effectiveBps = Math.max(5, rail.basisPoints - tierDiscountBps);
  const variableFee = Math.round((amountCents * effectiveBps) / 10000);
  const totalFeeCents = rail.baseFeeCents + variableFee;
  const netAmountCents = Math.max(0, amountCents - totalFeeCents);

  return {
    rail: rail.code,
    amountCents,
    baseFeeCents: rail.baseFeeCents,
    effectiveBps,
    variableFeeCents: variableFee,
    totalFeeCents,
    netAmountCents
  };
};

module.exports = { calculateTransactionFee };
