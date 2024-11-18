const schedule = require('node-schedule');

// Job 1: Run every second
const everySecondJob = schedule.scheduleJob('*/1 * * * * *', () => {
  console.log('Job 1: Runs every second');
  // Add logic for this job
});

// Job 2: Run every minute
const everyMinuteJob = schedule.scheduleJob('0 * * * * *', () => {
  console.log('Job 2: Runs every minute');
  // Add logic for this job
});

// Job 3: Run daily at midnight
const dailyJob = schedule.scheduleJob('0 0 * * *', () => {
  console.log('Job 3: Runs daily at midnight');
  // Add logic for this job
});

// Export all jobs if needed for control or testing
module.exports = { everySecondJob, everyMinuteJob, dailyJob };
