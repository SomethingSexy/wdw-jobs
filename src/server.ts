import Queue from 'bull';
import path from 'path';

// TODO: move to .env
// default number of dbs is 0-15
const redisConfig = { redis: { port: 6379, host: 'localhost', db: 15 } };
const waitTimePath = path.resolve(__dirname + '/../modules/jobs/waittimes.js');

// const dataQueue = new Queue('data fetching and updating', redisConfig);
const waitTimesQueue = new Queue('wait time fetching and updating', redisConfig);
waitTimesQueue.empty();
waitTimesQueue.process(waitTimePath);

// Cron or repeat for this job? Since we want it to run everyday, every 5 mins
waitTimesQueue.add({ }, { repeat: { every: 10000 } });

// schedules... every day check the latest out we can

// data maybe once a month?


