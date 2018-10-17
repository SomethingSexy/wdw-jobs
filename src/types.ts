export interface IServerConfig {
  job: {
    activitiesScheduleCron: string;
    locationsScheduleCron: string;
    waittimesEvery: number;
  };
  log: {
    console: string | boolean | undefined;
    errorFile: string | undefined;
    file: string | undefined;
    format: string | undefined;
    level: string;
  };
  name: string;
  port: string | number;
  services: {
    activitiesRoot: string | undefined;
    diningRoot: string | undefined;
    locationsRoot: string | undefined;
    parksRoot: string | undefined;
    resortsRoot: string | undefined;
    root: string | undefined;
    shopsRoot: string | undefined;
  };
}
