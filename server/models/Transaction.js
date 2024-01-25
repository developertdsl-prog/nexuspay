const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  intentId: {
    type: String,
    required: true,
    index: true
  },
  merchantId: {
    type: String,
    required: true,
    index: true
  },
  rail: {
    type: String,
    required: true
  },
  railReference: {
    type: String,
    required: true,
    unique: true
  },
  amountCents: {
    type: Number,
    required: true
  },
  feeCents: {
    type: Number,
    required: true
  },
  netAmountCents: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  settlementStatus: {
    type: String,
    enum: ['PENDING_CLEARING', 'SETTLED', 'ESCROW_HELD', 'FAILED', 'REVERSED'],
    default: 'PENDING_CLEARING'
  },
  settlementDate: {
    type: Date
  }
}, { timestamps: true });

TransactionSchema.index({ merchantId: 1, settlementStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', TransactionSchema);
