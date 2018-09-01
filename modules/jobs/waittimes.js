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
exports.default = async (_) => {
    const realtimeModels = wdw_data_1.realtime(log_1.default);
    const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.locationsRoot}?type=theme-park`, {
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
    // save the same timestamp for all
    const timeStamp = moment_1.default.utc().format();
    const responses = await Promise.all(parks.reduce((all, park) => {
        return [
            ...all,
            realtimeModels.parks.waitTimes(park)
        ];
    }, []));
    const waitTimes = responses.reduce((all, r) => all.concat(r), []);
    const postResponse = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.activitiesRoot}/waittimes/${timeStamp}`, {
        body: JSON.stringify(waitTimes),
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
    });
    if (postResponse.ok) {
        log_1.default.log('info', `Successfully updated wait times.`);
    }
    else {
        log_1.default.log('error', `Failed to updated wait times.`);
    }
    return responses;
};
//# sourceMappingURL=waittimes.js.map