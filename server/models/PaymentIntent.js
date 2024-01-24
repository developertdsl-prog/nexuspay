const mongoose = require('mongoose');

const PaymentIntentSchema = new mongoose.Schema({
  intentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  merchantId: {
    type: String,
    required: true,
    index: true
  },
  amountCents: {
    type: Number,
    required: true,
    min: 100 // Minimum $1.00 transaction
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    default: 'USD'
  },
  rail: {
    type: String,
    required: true,
    enum: ['ACH', 'FEDWIRE', 'SEPA_CREDIT', 'CARD', 'RTP']
  },
  customer: {
    customerId: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    accountNumberMask: String,
    routingNumberMask: String
  },
  status: {
    type: String,
    enum: ['CREATED', 'RESERVED', 'PROCESSING', 'SUCCEEDED', 'IN_ESCROW', 'FAILED', 'CANCELLED'],
    default: 'CREATED',
    index: true
  },
  feeCents: {
    type: Number,
    default: 0
  },
  netAmountCents: {
    type: Number,
    default: 0
  },
  requiresEscrow: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: 'B2B Settlement Transaction'
  },
  idempotencyKey: {
    type: String,
    index: true
  },
  metadata: {
    type: Map,
    of: String
  }
}, { timestamps: true });

PaymentIntentSchema.index({ merchantId: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('PaymentIntent', PaymentIntentSchema);
