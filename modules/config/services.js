"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const { SERVICES_URL_ROOT, SERVICES_LOCATIONS_ROOT, SERVICES_ACTIVITIES_ROOT, SERVICES_DINING_ROOT } = process.env;
const servicesSchema = joi_1.default.object({
    activitiesRoot: joi_1.default.string().required(),
    diningRoot: joi_1.default.string().required(),
    locationsRoot: joi_1.default.string().required(),
    root: joi_1.default.string().required()
});
const { error, value: envVars } = joi_1.default.validate({
    activitiesRoot: SERVICES_ACTIVITIES_ROOT,
    diningRoot: SERVICES_DINING_ROOT,
    locationsRoot: SERVICES_LOCATIONS_ROOT,
    root: SERVICES_URL_ROOT
}, servicesSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
exports.default = Object.assign({}, envVars);
//# sourceMappingURL=services.js.map