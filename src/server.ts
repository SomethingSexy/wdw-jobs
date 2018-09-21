import Queue from 'bull';
import path from 'path';
import config from './config/index';
import logger from './log';

const { job } = config;
// TODO: move to .env
// default number of dbs is 0-15
const redisConfig = { redis: { port: 6379, host: 'localhost', db: 15 } };
const waitTimePath = path.resolve(__dirname + '/../modules/jobs/waittimes.js');
const activitySchedulesPath = path.resolve(__dirname + '/../modules/jobs/activitySchedules.js');
const locationSchedulesPath = path.resolve(__dirname + '/../modules/jobs/locationSchedules.js');

const waitTimesQueue = new Queue('wait time fetching and updating', redisConfig);
logger.log('info', 'Created wait times queue.');
waitTimesQueue
  .on('error', error => {
    logger.log('error', `Wait time job failed with ${error.toString()}`);
  })
  .on('stalled', jobber => {
    logger.log('warn', `Job ${jobber.id} wait time queue stalled.`);
  })
  .on('failed', (jobber, error) => {
    logger.log('error', `Job ${jobber.id} wait time queue failed with ${error.toString()}`);
  })
  .empty()
  .then(() => {
    logger.log('info', 'Cleared wait times queue.');
    waitTimesQueue.process(waitTimePath);
    // Using repeat here for now.
    // TODO: Setting it up this way cause typings are borked for this guy
    waitTimesQueue.add({ balls: '5' }, { repeat: { every: job.waittimesEvery } });
    logger.log('info', `Added wait times job that runs every ${job.waittimesEvery} ms.`);
  });

const activities = new Queue('schdules fetching and updating', redisConfig);
logger.log('info', 'Created activities schedules queue.');
activities
  .empty()
  .then(() => {
    logger.log('info', 'Cleared activities schedules queue.');
    activities.process(activitySchedulesPath);
    activities.add({}, { repeat: { cron: job.activitiesScheduleCron } });
    logger.log('info', `Added activities job that runs every ${job.activitiesScheduleCron}.`);
  });

const locations = new Queue('schdules fetching and updating', redisConfig);
logger.log('info', 'Created locations schedules queue.');
activities
  .empty()
  .then(() => {
    logger.log('info', 'Cleared locations schedules queue.');
    locations.process(locationSchedulesPath);
    locations.add({}, { repeat: { cron: job.locationsScheduleCron } });
    logger.log('info', `Added locations job that runs every ${job.locationsScheduleCron}.`);
  });

// data maybe once a month?
