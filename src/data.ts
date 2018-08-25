import fetch from 'node-fetch';
import { realtime } from 'wdw-data';
import config from './config/index';
import logger from './log';

interface IOptions {
  activities?: boolean;
  dining?: boolean;
  locations?: boolean;
}

/**
 * A service for retrieving and persisting waitimes.
 */
export default async (options: IOptions =
    { locations: true, dining: true, activities: true }
) => {
  const realtimeModels = realtime(logger);

  logger.log('info', `This job is running ${JSON.stringify(options)}.`);

  // // grab our realtime park data
  if (options.locations) {
    try {
      const parks = await realtimeModels
        .parks
        .list();

      logger.log('info', `Retrieved ${parks.length} park locations.`);
      const response = await fetch(`${config.services.root}${config.services.locationsRoot}`, {
        body: JSON.stringify(parks),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      });

      if (response.ok) {
        const locs = await response.json();
        logger.log('info', `Successfully added or updated ${locs.length} park locations.`);
      } else {
        const text = await response.text();
        logger.log('error', `There was error trying to update park locations ${text}`);
      }
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.locations) {
    try {
      const hotels = await realtimeModels
        .hotels
        .list();

      logger.log('info', `Retrieved ${hotels.length} hotel locations.`);
      const response = await fetch(`${config.services.root}${config.services.locationsRoot}`, {
        body: JSON.stringify(hotels),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      });

      if (response.ok) {
        const locs = await response.json();
        logger.log('info', `Successfully added or updated ${locs.length} park locations.`);
      } else {
        const text = await response.text();
        logger.log('error', `There was error trying to update park locations ${text}`);
      }
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.activities) {
    try {
      const attractions = await realtimeModels
        .attractions
        .list();

      logger.log('info', JSON.stringify(attractions, null, 4));
      // await models.activity.addUpdateActivities(attractions);
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.activities) {
    try {
      const entertainment = await realtimeModels
        .entertainment
        .list();

      logger.log('info', JSON.stringify(entertainment, null, 4));
      // await models.activity.addUpdateActivities(entertainment);
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.dining) {
    try {
      const dining = await realtimeModels
        .dining
        .list({ max: 50 });
      logger.log('info', JSON.stringify(dining, null, 4));
      // await models.dining.addUpdate(dining);
    } catch (e) {
      logger.log('error', e.toString());
    }
  }
};
