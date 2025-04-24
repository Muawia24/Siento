import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import emailQueue from './utils/emailQueue.js';
import db from './config/db_config.js';


// Start the worker
(async () => {
  await db.connect();
  
  console.log('Bull queue worker started...');
  emailQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });
})();
