import type { Config } from '@panda/cli-config';
import { AppBuilder } from './application';

export default async (config: Config) => {
  const app = new AppBuilder(config);
  await app.run();
};
