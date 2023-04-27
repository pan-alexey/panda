import { CliConfig, Config } from '@panda/cli-config';

export default async (cliConfig: CliConfig): Promise<Config> => {
  try {
    const callback = cliConfig.getConfig();

    console.log(`[${new Date().toISOString()}] Calling config function`);
    const config = await callback();

    return config;
  } catch (error) {
    console.log(`[${new Date().toISOString()}] Error execute config:`);
    console.log(error);
    process.exit(1);
  }
};
