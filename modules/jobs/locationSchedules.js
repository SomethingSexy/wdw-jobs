"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
require("moment-holiday");
const node_fetch_1 = __importDefault(require("node-fetch"));
const wdw_data_1 = require("wdw-data");
const index_1 = __importDefault(require("../config/index"));
const log_1 = __importDefault(require("../log"));
/**
 * A job for updating the hours for supported locations.
 */
exports.default = async (job) => {
    const days = job.data.days;
    const realtimeModels = wdw_data_1.realtime(log_1.default);
    const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.parksRoot}?fetchSchedule=true`, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'get'
    });
    if (!response.ok) {
        log_1.default.log('error', `There was an issue trying to fetch locations ${response.statusText}.`);
    }
    const parks = await response.json();
    log_1.default.log('info', `Found ${parks.length} locations to find schedules for.`);
    const startDate = moment_1.default().format('YYYY-MM-DD');
    const endDate = days ? moment_1.default().add(days, 'days').format('YYYY-MM-DD') : startDate;
    const responses = await Promise.all(parks.reduce((all, park) => {
        return [
            ...all,
            realtimeModels.parks.hours(park, startDate, endDate)
                .then(p => (Object.assign({}, p, { id: park.id })))
        ];
    }, []));
    log_1.default.log('debug', JSON.stringify(responses, null, 4));
    for (const parkSchedule of responses) {
        const postResponse = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.parksRoot}/${parkSchedule.id}/schedules`, {
            body: JSON.stringify(parkSchedule.schedule),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            method: 'post'
        });
        if (postResponse.ok) {
            log_1.default.log('info', `Successfully updated schedules for location ${parkSchedule.id}.`);
        }
        else {
            log_1.default.log('error', `Failed to updated schedules for location ${parkSchedule.id} ${postResponse.statusText}.`);
        }
    }
    return null;
};
//# sourceMappingURL=locationSchedules.js.map