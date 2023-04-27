// import { App } from '@panda/cli-app';
// import type { Config } from '@panda/cli-app';
import { CliConfig } from '@panda/cli-config';
import type { Config } from '@panda/cli-config';
export type { Config };

export const config = (configFn: () => Promise<Config>) => {
  return new CliConfig(configFn);
};

module.exports = config; // for js library;
export default config;
