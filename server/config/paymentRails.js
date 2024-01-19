/**
 * NexusPay Multi-Rail Supported Protocols and Fee Parameters
 */
const PAYMENT_RAILS = {
  ACH: {
    code: 'ACH',
    name: 'Automated Clearing House (Domestic US)',
    cutoffTime: '17:00 EST',
    settlementDays: 2,
    baseFeeCents: 25,
    basisPoints: 80, // 0.80%
    maxAmountCents: 10000000, // $100,000.00
    currencies: ['USD'],
    supportsEscrow: true,
    riskTier: 'LOW'
  },
  FEDWIRE: {
    code: 'FEDWIRE',
    name: 'Federal Reserve Wire Network (Gross Settlement)',
    cutoffTime: '18:30 EST',
    settlementDays: 0, // Same-day gross
    baseFeeCents: 1500, // $15.00
    basisPoints: 15, // 0.15%
    maxAmountCents: 500000000, // $5,000,000.00
    currencies: ['USD'],
    supportsEscrow: true,
    riskTier: 'VERY_LOW'
  },
  SEPA_CREDIT: {
    code: 'SEPA_CREDIT',
    name: 'Single Euro Payments Area Credit Transfer',
    cutoffTime: '16:00 CET',
    settlementDays: 1,
    baseFeeCents: 35,
    basisPoints: 60, // 0.60%
    maxAmountCents: 20000000, // €200,000.00
    currencies: ['EUR'],
    supportsEscrow: true,
    riskTier: 'LOW'
  },
  CARD: {
    code: 'CARD',
    name: 'Commercial Interchange Credit & Debit Rails',
    cutoffTime: '23:59 UTC',
    settlementDays: 2,
    baseFeeCents: 30,
    basisPoints: 240, // 2.40%
    maxAmountCents: 2500000, // $25,000.00
    currencies: ['USD', 'EUR', 'GBP', 'CAD'],
    supportsEscrow: false,
    riskTier: 'MEDIUM'
  },
  RTP: {
    code: 'RTP',
    name: 'Real-Time Payments Clearinghouse (Instant)',
    cutoffTime: '24/7/365',
    settlementDays: 0,
    baseFeeCents: 75,
    basisPoints: 95, // 0.95%
    maxAmountCents: 100000000, // $1,000,000.00
    currencies: ['USD'],
    supportsEscrow: true,
    riskTier: 'LOW'
  }
};

module.exports = { PAYMENT_RAILS };
