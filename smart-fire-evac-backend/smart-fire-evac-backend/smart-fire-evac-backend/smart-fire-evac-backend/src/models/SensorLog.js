const mongoose = require('mongoose');

const sensorLogSchema = new mongoose.Schema({
  zone: { type: String, required: true },
  sensorType: { type: String, enum: ['smoke', 'temperature', 'gas'] },
  value: { type: Number, required: true },
  unit: String,
  status: { type: String, enum: ['NORMAL', 'WARNING', 'DANGER'] },
  timestamp: { type: Date, default: Date.now }
});

sensorLogSchema.index({ zone: 1, timestamp: -1 });

module.exports = mongoose.model('SensorLog', sensorLogSchema);