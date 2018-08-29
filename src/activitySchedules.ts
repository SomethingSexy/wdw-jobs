import moment from 'moment';
import 'moment-holiday';
import fetch from 'node-fetch';
import { realtime } from 'wdw-data';
import config from './config/index';
import logger from './log';
/**
 * Service for updating hours
 */
export default async (days?: number) => {
  const realtimeModels = realtime(logger);
  const response = await fetch(
    `${config.services.root}${config.services.activitiesRoot}?fetchSchedule=true`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'get'
    }
  );

  if (!response.ok) {
    logger.log('error', `There was an issue trying to fetch activities ${response.statusText}.`);
  }

  const activities = await response.json();
  logger.log('info', `Found ${activities.length} activities to find schedules for.`);

  const startDate = moment().format('YYYY-MM-DD');
  let activitySchedules: any[] = await realtimeModels.entertainment.schedule(startDate);
  logger.log('info', 'Retrieved entertainment schedules');

  activitySchedules = activitySchedules
    .reduce(
      (all, eS) => {
        const found = activities.find(e => e.extId === eS.id);
        if (!found) {
          return all;
        }

        return [
          ...all,
          { ...eS, id: found.id }
        ];
      },
      []
    );

  for (const activitySchedule of activitySchedules) {
    const postResponse = await fetch(
      `${config.services.root}${config.services.activitiesRoot}/${activitySchedule.id}/schedules`, {
        body: JSON.stringify(activitySchedule.schedule),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      }
    );

    if (postResponse.ok) {
      logger.log(
        'info',
        `Successfully updated schedules for activity ${activitySchedule.id}.`
      );
    } else {
      logger.log(
        'error',
        `Failed to updated schedules for activity ${activitySchedule.id} ${postResponse.statusText}.` // tslint:disable-line
    );
    }
  }

  return null;
};
