const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  merchantId: {
    type: String,
    required: true,
    index: true
  },
  method: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  statusCode: {
    type: Number,
    required: true
  },
  ipAddress: {
    type: String
  },
  durationMs: {
    type: Number
  },
  payloadSummary: {
    type: String
  }
}, { timestamps: true });

AuditLogSchema.index({ merchantId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
