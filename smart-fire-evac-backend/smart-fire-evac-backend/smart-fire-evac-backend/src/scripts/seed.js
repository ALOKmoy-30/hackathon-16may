const mongoose = require('mongoose');
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');
require('dotenv').config({ path: '../../.env' });

const seedDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  await User.deleteMany({});
  await SystemConfig.deleteMany({});

  await User.create([
    { email: 'admin@fireevac.com', password: 'Admin@123', role: 'admin', name: 'System Admin' },
    { email: 'viewer@fireevac.com', password: 'Viewer@123', role: 'viewer', name: 'View Only User' }
  ]);

  await SystemConfig.findOneAndUpdate({}, {}, { upsert: true, new: true });

  console.log('Seed complete');
  process.exit();
};

seedDB();