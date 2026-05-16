const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  type: { type: String, enum: ['SMOKE', 'TEMPERATURE', 'GAS'] },
  severity: { type: String, enum: ['WARNING', 'DANGER'] },
  message: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  resolvedAt: Date,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);