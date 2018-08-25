import joi from 'joi';

const { SERVICES_URL_ROOT, SERVICES_LOCATIONS_ROOT } = process.env;

const servicesSchema = joi.object({
  locationsRoot: joi.string().required(),
  root: joi.string().required()
});

const { error, value: envVars } = joi.validate(
  {
    locationsRoot: SERVICES_LOCATIONS_ROOT,
    root: SERVICES_URL_ROOT
  },
  servicesSchema
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  ...envVars
};
