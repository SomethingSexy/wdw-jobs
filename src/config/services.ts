import joi from 'joi';

const {
  SERVICES_URL_ROOT,
  SERVICES_LOCATIONS_ROOT,
  SERVICES_ACTIVITIES_ROOT,
  SERVICES_DINING_ROOT,
  SERVICES_SHOPS_ROOT
} = process.env;

const servicesSchema = joi.object({
  activitiesRoot: joi.string().required(),
  diningRoot: joi.string().required(),
  locationsRoot: joi.string().required(),
  root: joi.string().required(),
  shopsRoot: joi.string().required(),
});

const { error, value: envVars } = joi.validate(
  {
    activitiesRoot: SERVICES_ACTIVITIES_ROOT,
    diningRoot: SERVICES_DINING_ROOT,
    locationsRoot: SERVICES_LOCATIONS_ROOT,
    root: SERVICES_URL_ROOT,
    shopsRoot: SERVICES_SHOPS_ROOT
  },
  servicesSchema
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  ...envVars
};
