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
const waitTimePath = path_1.default.resolve(__dirname + '/../modules/jobs/waittimes.js');
const activitySchedulesPath = path_1.default.resolve(__dirname + '/../modules/jobs/activitySchedules.js');
// const locationSchedulesPath = path.resolve(__dirname + '/../modules/jobs/locationSchedules.js');
const waitTimesQueue = new bull_1.default('wait time fetching and updating', redisConfig);
log_1.default.log('info', 'Created wait times queue.');
waitTimesQueue
    .empty()
    .then(() => {
    log_1.default.log('info', 'Cleared wait times queue.');
    waitTimesQueue.process(waitTimePath);
    // Using repeat here for now.
    // TODO: Setting it up this way cause typings are borked for this guy
    waitTimesQueue.add({}, { repeat: { every: job.waittimesEvery } });
    log_1.default.log('info', `Added wait times job that runs every ${job.waittimesEvery} ms.`);
});
const schedules = new bull_1.default('schdules fetching and updating', redisConfig);
log_1.default.log('info', 'Created schedules queue.');
schedules
    .empty()
    .then(() => {
    log_1.default.log('info', 'Cleared schedules queue.');
    schedules.process(activitySchedulesPath);
    // schedules.process('location', locationSchedulesPath);
    schedules.add({}, { repeat: { cron: '* * * * *' } });
    // logger.log('info', `Added wait times job that runs every ${job.activitiesScheduleCron}.`);
    // schedules.add('location', {}, { repeat: { cron: '* * * * *'  } });
    // logger.log(
    //   'info',
    //   `Added location schedules job that runs every ${job.locationsScheduleCron}.`
    // );
});
// data maybe once a month?
//# sourceMappingURL=server.js.map