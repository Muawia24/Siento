import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import emailQueue from './utils/emailQueue.js';
import db from './config/db_config.js';

console.log('Environment:', {
  EMAIL_USER: process.env.EMAIL_USER ? '✅ Loaded' : '❌ Missing',
  MONGODB_URI: process.env.MONGO_URI ? '✅ Loaded' : '❌ Missing'
});

// Start the worker
(async () => {
  await db.connect();
  
  console.log('Bull queue worker started...');
  emailQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });
})();
