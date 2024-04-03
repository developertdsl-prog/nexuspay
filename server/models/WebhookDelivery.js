const mongoose = require('mongoose');

const WebhookDeliverySchema = new mongoose.Schema({
  deliveryId: {
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
  eventType: {
    type: String,
    required: true
  },
  targetUrl: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  responseStatus: {
    type: Number,
    default: 200
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  success: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

WebhookDeliverySchema.index({ merchantId: 1, createdAt: -1 });

module.exports = mongoose.model('WebhookDelivery', WebhookDeliverySchema);
