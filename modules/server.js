"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./config/index"));
const log_1 = __importDefault(require("./log"));
const { job } = index_1.default;
// TODO: move to .env
// default number of dbs is 0-15
const redisConfig = { redis: { port: 6379, host: 'localhost', db: 15 } };
// const waitTimePath = path.resolve(__dirname + '/../modules/jobs/waittimes.js');
// const activitySchedulesPath = path.resolve(__dirname + '/../modules/jobs/activitySchedules.js');
const locationSchedulesPath = path_1.default.resolve(__dirname + '/../modules/jobs/locationSchedules.js');
// const waitTimesQueue = new Queue('wait time fetching and updating', redisConfig);
// logger.log('info', 'Created wait times queue.');
// waitTimesQueue
//   .on('error', error => {
//     logger.log('error', `Wait time job failed with ${error.toString()}`);
//   })
//   .on('stalled', jobber => {
//     logger.log('warn', `Job ${jobber.id} wait time queue stalled.`);
//   })
//   .on('failed', (jobber, error) => {
//     logger.log('error', `Job ${jobber.id} wait time queue failed with ${error.toString()}`);
//   })
//   .empty()
//   .then(() => {
//     logger.log('info', 'Cleared wait times queue.');
//     waitTimesQueue.process(waitTimePath);
//     // Using repeat here for now.
//     // TODO: Setting it up this way cause typings are borked for this guy
//     waitTimesQueue.add({ balls: '5' }, { repeat: { every: job.waittimesEvery } });
//     logger.log('info', `Added wait times job that runs every ${job.waittimesEvery} ms.`);
//   });
// const activities = new Queue('schedules fetching and updating', redisConfig);
// logger.log('info', 'Created activities schedules queue.');
// activities
//   .empty()
//   .then(() => {
//     logger.log('info', 'Cleared activities schedules queue.');
//     activities.process(activitySchedulesPath);
//     activities.add({}, { repeat: { cron: job.activitiesScheduleCron } });
//     logger.log('info', `Added activities job that runs every ${job.activitiesScheduleCron}.`);
//   });
const locations = new bull_1.default('schedules fetching and updating', redisConfig);
log_1.default.log('info', 'Created locations schedules queue.');
locations
    .on('error', error => {
    log_1.default.log('error', `Schedule job failed with ${error.toString()}`);
})
    .on('stalled', jobber => {
    log_1.default.log('warn', `Job ${jobber.id} schedule queue stalled.`);
})
    .on('failed', (jobber, error) => {
    log_1.default.log('error', `Job ${jobber.id} schedule queue failed with ${error.toString()}`);
})
    .empty()
    .then(() => {
    log_1.default.log('info', 'Cleared locations schedules queue.');
    locations.process(locationSchedulesPath);
    locations.add({}, { repeat: { cron: job.locationsScheduleCron } });
    log_1.default.log('info', `Added locations job that runs every ${job.locationsScheduleCron}.`);
});
// data maybe once a month?
//# sourceMappingURL=server.js.map