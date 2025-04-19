import emailQueue from './utils/emailQueue.js';

console.log('🔵 Starting test...');

// Verify queue connection
console.log('Queue connected?', emailQueue.client.status === 'ready' ? '✅' : '❌');

// Test job data
const testJob = {
  test: true,
  timestamp: new Date().toISOString()
};

// Add job with timeout
try {
  const job = await emailQueue.add(testJob);
  console.log(`📝 Added test job ID: ${job.id}`);
  
  // Debugging listeners
  emailQueue.on('active', (job) => {
    console.log(`🟡 Job ${job.id} started processing`);
  });

  emailQueue.on('completed', (job) => {
    console.log(`✅ Job ${job.id} completed`);
    console.log('Result:', job.returnvalue);
    process.exit(0);
  });

  emailQueue.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err);
    process.exit(1);
  });

  // Timeout after 10 seconds
  setTimeout(() => {
    console.log('⌛ Timeout - job not processed');
    emailQueue.getJob(job.id).then(j => {
      console.log('Job status:', j?.status);
    });
    process.exit(1);
  }, 10000);

} catch (err) {
  console.error('🚨 Error adding job:', err);
  process.exit(1);
}
