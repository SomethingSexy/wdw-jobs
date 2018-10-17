import joi from 'joi';

const {
  JOB_WAITTIMES_EVERY,
  JOB_ACTIVITIES_SCHEDULE_CRON,
  JOB_LOCATIONS_SCHEDULE_CRON
} = process.env;

const jobSchema = joi.object({
  activitiesScheduleCron: joi.string().required(),
  locationsScheduleCron: joi.string().required(),
  waittimesEvery: joi.number().required()
});

const { error, value: envVars } = joi.validate(
  {
    activitiesScheduleCron: JOB_ACTIVITIES_SCHEDULE_CRON || '',
    locationsScheduleCron: JOB_LOCATIONS_SCHEDULE_CRON || '',
    waittimesEvery: parseInt(JOB_WAITTIMES_EVERY || '100000', 10)
  },
  jobSchema
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  ...envVars
};
