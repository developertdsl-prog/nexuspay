const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
  merchantId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  webhookUrl: {
    type: String,
    default: ''
  },
  webhookSecret: {
    type: String,
    required: true
  },
  tier: {
    type: String,
    enum: ['STANDARD', 'GROWTH', 'ENTERPRISE'],
    default: 'STANDARD'
  },
  balanceCents: {
    type: Number,
    default: 0,
    min: 0
  },
  escrowHoldCents: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

MerchantSchema.index({ active: 1, tier: 1 });

module.exports = mongoose.model('Merchant', MerchantSchema);
