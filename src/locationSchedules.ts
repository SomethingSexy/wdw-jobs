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
    `${config.services.root}${config.services.locationsRoot}?fetchSchedule=true`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'get'
    }
  );

  if (!response.ok) {
    logger.log('error', `There was an issue trying to fetch locations ${response.statusText}.`);
  }

  const parks = await response.json();
  logger.log('info', `Found ${parks.length} locations to find schedules for.`);

  const startDate = moment().format('YYYY-MM-DD');
  const endDate = days ? moment().add(days, 'days').format('YYYY-MM-DD') : startDate;

  const responses: any[] = await Promise.all(
    parks.reduce(
      (all, park) => {
        return [
          ...all,
          realtimeModels.parks.hours(park, startDate, endDate)
            .then(p => ({ ...p, id: park.id }))
        ];
      },
      []
    )
  );

  for (const parkSchedule of responses) {
    const postResponse = await fetch(
      `${config.services.root}${config.services.locationsRoot}/${parkSchedule.id}/schedules`, {
        body: JSON.stringify(parkSchedule.schedule),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      }
    );

    if (postResponse.ok) {
      logger.log('info', `Successfully updated schedules for location ${parkSchedule.id}.`);
    } else {
      logger.log(
        'error',
        `Failed to updated schedules for location ${parkSchedule.id} ${postResponse.statusText}.`
      );
    }
  }

  return null;
};
