import { sendWeeklyEmails } from './emailService.js';
import redisConfig from './redisConfig.js';
import Queue from 'bull';


// Initialize the queue
const emailQueue = new Queue('weekly-emails', {
  redis: redisConfig, // Your Redis connection config
});

// Add job to queue (run every Saturday at 9 AM)
emailQueue.add(
  {}, 
  {
    repeat: { cron: '0 9 * * 6' }, // (Saturday 9 AM)
    attempts: 3, // Retry 3 times on failure
    backoff: 5000, // Retry after 5 seconds
  }
);

// Process jobs
emailQueue.process(async (job) => {
  console.log('Processing weekly emails...');
  await sendWeeklyEmails();
});

// Handle job events
emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

export default emailQueue;