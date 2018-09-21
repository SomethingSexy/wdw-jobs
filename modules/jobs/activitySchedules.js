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
 * Service for updating hours
 */
exports.default = async (_) => {
    const realtimeModels = wdw_data_1.realtime(log_1.default);
    const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.activitiesRoot}?fetchSchedule=true`, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'get'
    });
    if (!response.ok) {
        log_1.default.log('error', `There was an issue trying to fetch activities ${response.statusText}.`);
    }
    const activities = await response.json();
    log_1.default.log('info', `Found ${activities.length} activities to find schedules for.`);
    const startDate = moment_1.default().format('YYYY-MM-DD');
    let activitySchedules = await realtimeModels.entertainment.schedule(startDate);
    log_1.default.log('info', 'Retrieved entertainment schedules');
    activitySchedules = activitySchedules
        .reduce((all, eS) => {
        const found = activities.find(e => e.extId === eS.id);
        if (!found) {
            return all;
        }
        return [
            ...all,
            Object.assign({}, eS, { id: found.id })
        ];
    }, []);
    for (const activitySchedule of activitySchedules) {
        const postResponse = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.activitiesRoot}/${activitySchedule.id}/schedules`, {
            body: JSON.stringify(activitySchedule.schedule),
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            method: 'post'
        });
        if (postResponse.ok) {
            log_1.default.log('info', `Successfully updated schedules for activity ${activitySchedule.id}.`);
        }
        else {
            log_1.default.log('error', `Failed to updated schedules for activity ${activitySchedule.id} ${postResponse.statusText}.` // tslint:disable-line
            );
        }
    }
    return null;
};
//# sourceMappingURL=activitySchedules.js.map