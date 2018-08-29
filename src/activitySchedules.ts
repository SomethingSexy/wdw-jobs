import moment from 'moment';
import 'moment-holiday';
import { createModels, realtime } from 'wdw-data';
import logger from './log';
/**
 * Service for updating hours
 */
export default async (days?: number) => {
  // get all activities that can fetch schedules
  const entertainment = await models.activity.list({ fetchSchedule: true });

  logger.log('info', 'retrieving entertainment schedules');
  let entertainmentSchedules: any[] = await realtimeModels.entertainment.schedule(startDate);
  logger.log('info', 'retrieved entertainment schedules');

  entertainmentSchedules = entertainmentSchedules
    .reduce(
      (all, eS) => {
        const found = entertainment.find(e => e.extId === eS.id);
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

  for (const entertainmentSchedule of entertainmentSchedules) {
    logger.log('info', 'Adding schedule to database');
    await models.activity.addSchedules(
      entertainmentSchedule.id,
      entertainmentSchedule.schedule
    );
  }
  return null;
};
