"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const { JOB_WAITTIMES_EVERY, JOB_ACTIVITIES_SCHEDULE_CRON, JOB_LOCATIONS_SCHEDULE_CRON } = process.env;
const jobSchema = joi_1.default.object({
    activitiesScheduleCron: joi_1.default.string().required(),
    locationsScheduleCron: joi_1.default.string().required(),
    waittimesEvery: joi_1.default.number().required()
});
const { error, value: envVars } = joi_1.default.validate({
    activitiesScheduleCron: JOB_ACTIVITIES_SCHEDULE_CRON,
    locationsScheduleCron: JOB_LOCATIONS_SCHEDULE_CRON,
    waittimesEvery: parseInt(JOB_WAITTIMES_EVERY || '100000', 10)
}, jobSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = Object.assign({}, envVars);
//# sourceMappingURL=job.js.map