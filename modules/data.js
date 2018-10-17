"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const wdw_data_1 = require("wdw-data");
const index_1 = __importDefault(require("./config/index"));
const log_1 = __importDefault(require("./log"));
/**
 * A service for retrieving and persisting waitimes.
 */
exports.default = async (options = { parks: true, dining: true, activities: true, resorts: true }) => {
    const realtimeModels = wdw_data_1.realtime(log_1.default);
    log_1.default.log('info', `This job is running ${JSON.stringify(options)}.`);
    // // grab our realtime park data
    if (options.parks) {
        try {
            const parks = await realtimeModels
                .parks
                .list();
            log_1.default.log('info', `Retrieved ${parks.length} park locations.`);
            const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.parksRoot}`, {
                body: JSON.stringify(parks),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                method: 'post'
            });
            if (response.ok) {
                const list = await response.json();
                log_1.default.log('info', `Successfully added or updated ${list.length} park locations.`);
            }
            else {
                const text = await response.text();
                log_1.default.log('error', `There was error trying to update park locations ${text}`);
            }
        }
        catch (e) {
            log_1.default.log('error', e.toString());
        }
    }
    if (options.resorts) {
        try {
            const hotels = await realtimeModels
                .hotels
                .list();
            log_1.default.log('info', `Retrieved ${hotels.length} hotel locations.`);
            const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.resortsRoot}`, {
                body: JSON.stringify(hotels),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                method: 'post'
            });
            if (response.ok) {
                const list = await response.json();
                log_1.default.log('info', `Successfully added or updated ${list.length} park locations.`);
            }
            else {
                const text = await response.text();
                log_1.default.log('error', `There was error trying to update park locations ${text}`);
            }
        }
        catch (e) {
            log_1.default.log('error', e.toString());
        }
    }
    if (options.activities) {
        try {
            const attractions = await realtimeModels
                .attractions
                .list();
            log_1.default.log('info', `Retrieved ${attractions.length} attractions.`);
            const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.activitiesRoot}`, {
                body: JSON.stringify(attractions),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                method: 'post'
            });
            if (response.ok) {
                const list = await response.json();
                log_1.default.log('info', `Successfully added or updated ${list.length} park attractions.`);
            }
            else {
                const text = await response.text();
                log_1.default.log('error', `There was error trying to update park attractions ${text}`);
            }
        }
        catch (e) {
            log_1.default.log('error', e.toString());
        }
    }
    if (options.activities) {
        try {
            const entertainment = await realtimeModels
                .entertainment
                .list();
            log_1.default.log('info', `Retrieved ${entertainment.length} entertainment.`);
            const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.activitiesRoot}`, {
                body: JSON.stringify(entertainment),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                method: 'post'
            });
            if (response.ok) {
                const list = await response.json();
                log_1.default.log('info', `Successfully added or updated ${list.length} entertainment.`);
            }
            else {
                const text = await response.text();
                log_1.default.log('error', `There was error trying to update entertainment ${text}`);
            }
        }
        catch (e) {
            log_1.default.log('error', e.toString());
        }
    }
    if (options.dining) {
        try {
            const dining = await realtimeModels
                .dining
                .list({ max: 60 });
            log_1.default.log('info', `Retrieved ${dining.length} dining.`);
            const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.diningRoot}`, {
                body: JSON.stringify(dining),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                method: 'post'
            });
            if (response.ok) {
                const list = await response.json();
                log_1.default.log('info', `Successfully added or updated ${list.length} dining.`);
            }
            else {
                const text = await response.text();
                log_1.default.log('error', `There was error trying to update dining ${text}`);
            }
        }
        catch (e) {
            log_1.default.log('error', e.toString());
        }
    }
    if (options.shops) {
        try {
            const shops = await realtimeModels
                .shops
                .list({ max: 60 });
            log_1.default.log('info', `Retrieved ${shops.length} shops.`);
            const response = await node_fetch_1.default(`${index_1.default.services.root}${index_1.default.services.shopsRoot}`, {
                body: JSON.stringify(shops),
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                method: 'post'
            });
            if (response.ok) {
                const list = await response.json();
                log_1.default.log('info', `Successfully added or updated ${list.length} shops.`);
            }
            else {
                const text = await response.text();
                log_1.default.log('error', `There was error trying to update shop ${text}`);
            }
        }
        catch (e) {
            log_1.default.log('error', e.toString());
        }
    }
};
//# sourceMappingURL=data.js.map