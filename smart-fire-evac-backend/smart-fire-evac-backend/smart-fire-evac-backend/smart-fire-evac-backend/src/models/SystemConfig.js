const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  smokeThreshold: { type: Number, default: 700 },
  tempWarning: { type: Number, default: 45 },
  tempDanger: { type: Number, default: 60 },
  gasThreshold: { type: Number, default: 300 },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('SystemConfig', systemConfigSchema);