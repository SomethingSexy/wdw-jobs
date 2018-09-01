import moment from 'moment';
import 'moment-holiday';
import fetch from 'node-fetch';
import { realtime } from 'wdw-data';
import config from '../config/index';
import logger from '../log';

export default async _ => {
  const realtimeModels = realtime(logger);
  const response = await fetch(
    `${config.services.root}${config.services.locationsRoot}?type=theme-park`, {
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
  logger.log('info', `Found ${parks.length} locations to find wait times for.`);
  // save the same timestamp for all
  const timeStamp = moment.utc().format();

  const responses: any[] = await Promise.all(
    parks.reduce(
      (all, park) => {
        return [
          ...all,
          realtimeModels.parks.waitTimes(park)
        ];
      },
      []
    )
  );

  const waitTimes = responses.reduce((all, r) => all.concat(r), []);
  const postResponse = await fetch(
    `${config.services.root}${config.services.activitiesRoot}/waittimes/${timeStamp}`, {
      body: JSON.stringify(waitTimes),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'post'
    }
  );

  if (postResponse.ok) {
    logger.log('info', `Successfully updated wait times.`);
  } else {
    logger.log(
      'error',
      `Failed to updated wait times.`
    );
  }

  return responses;
};
