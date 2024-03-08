const mongoose = require('mongoose');

const EscrowAccountSchema = new mongoose.Schema({
  escrowId: {
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
  payerEmail: {
    type: String,
    required: true
  },
  amountCents: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['HELD', 'RELEASED', 'DISPUTED', 'REFUNDED'],
    default: 'HELD',
    index: true
  },
  releaseCondition: {
    type: String,
    default: 'Buyer delivery sign-off'
  },
  autoReleaseDays: {
    type: Number,
    default: 7
  },
  releaseDate: {
    type: Date
  },
  disputeReason: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('EscrowAccount', EscrowAccountSchema);
