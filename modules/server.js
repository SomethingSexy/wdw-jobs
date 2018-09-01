"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const path_1 = __importDefault(require("path"));
// import cluster from 'cluster';
// import { cpus } from 'os';
// import logger from './log';
// TODO: move to .env
// default number of dbs is 0-15
const redisConfig = { redis: { port: 6379, host: 'localhost', db: 15 } };
const waitTimePath = path_1.default.resolve(__dirname + '/../modules/jobs/waittimes.js');
// const dataQueue = new Queue('data fetching and updating', redisConfig);
const waitTimesQueue = new bull_1.default('wait time fetching and updating', redisConfig);
waitTimesQueue.process(waitTimePath);
waitTimesQueue.add({ video: 'http://example.com/video1.mov' });
// const numCPUs = cpus().length;
// if (cluster.isMaster) {
//   logger.info(`This machine has ${numCPUs} CPUs.`);
//   for (let i = 0; i < numCPUs; i += 1) {
//     cluster.fork();
//   }
//   cluster.on('online', worker => {
//     logger.info(`Worker ${worker.process.pid} is online`);
//   });
//   cluster.on('exit', (worker, code, signal) => {
//     logger.warn(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
//     logger.info('Starting a new worker...');
//     cluster.fork();
//   });
// } else {
// }
//# sourceMappingURL=server.js.map