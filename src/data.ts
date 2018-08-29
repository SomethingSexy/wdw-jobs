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
        const list = await response.json();
        logger.log('info', `Successfully added or updated ${list.length} park locations.`);
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
        const list = await response.json();
        logger.log('info', `Successfully added or updated ${list.length} park locations.`);
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

      logger.log('info', `Retrieved ${attractions.length} attractions.`);
      const response = await fetch(`${config.services.root}${config.services.activitiesRoot}`, {
        body: JSON.stringify(attractions),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      });

      if (response.ok) {
        const list = await response.json();
        logger.log('info', `Successfully added or updated ${list.length} park attractions.`);
      } else {
        const text = await response.text();
        logger.log('error', `There was error trying to update park attractions ${text}`);
      }
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.activities) {
    try {
      const entertainment = await realtimeModels
        .entertainment
        .list();

      logger.log('info', `Retrieved ${entertainment.length} entertainment.`);
      const response = await fetch(`${config.services.root}${config.services.activitiesRoot}`, {
        body: JSON.stringify(entertainment),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      });

      if (response.ok) {
        const list = await response.json();
        logger.log('info', `Successfully added or updated ${list.length} entertainment.`);
      } else {
        const text = await response.text();
        logger.log('error', `There was error trying to update entertainment ${text}`);
      }
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.dining) {
    try {
      const dining = await realtimeModels
        .dining
        .list({ max: 60 });

      logger.log('info', `Retrieved ${dining.length} dining.`);
      const response = await fetch(`${config.services.root}${config.services.diningRoot}`, {
        body: JSON.stringify(dining),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'post'
      });

      if (response.ok) {
        const list = await response.json();
        logger.log('info', `Successfully added or updated ${list.length} dining.`);
      } else {
        const text = await response.text();
        logger.log('error', `There was error trying to update dining ${text}`);
      }
    } catch (e) {
      logger.log('error', e.toString());
    }
  }
};
