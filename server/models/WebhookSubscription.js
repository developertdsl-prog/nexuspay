const mongoose = require('mongoose');

const WebhookSubscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  merchantId: {
    type: String,
    required: true,
    index: true
  },
  targetUrl: {
    type: String,
    required: true
  },
  events: [{
    type: String,
    enum: [
      'payment.created',
      'payment.succeeded',
      'payment.failed',
      'escrow.held',
      'escrow.released',
      'escrow.disputed'
    ]
  }],
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('WebhookSubscription', WebhookSubscriptionSchema);
