import { realtime } from 'wdw-data';
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

      logger.log('info', JSON.stringify(parks, null, 4));
      // await models.location.addUpdateParks(parks);
    } catch (e) {
      logger.log('error', e.toString());
    }
  }

  if (options.locations) {
    try {
      const hotels = await realtimeModels
        .hotels
        .list();

      logger.log('info', JSON.stringify(hotels, null, 4));
      // await models.location.addUpdateHotels(hotels);
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
