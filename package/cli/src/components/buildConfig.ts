import { CliConfig } from '@panda/cli-config';
import { configBuilder } from './build/index';

export interface BuildConfigProps {
  entry: string;
}

export default async (props: BuildConfigProps): Promise<CliConfig> => {
  console.log(`[${new Date().toISOString()}] Building config (${props.entry})`);
  const configFile = await configBuilder({
    entry: props.entry,
  });

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cliConfig = require(configFile).default;
    if (!(cliConfig instanceof CliConfig)) {
      console.log(
        `[${new Date().toISOString()}] Not valid config file. Config file must be return default export by config function;`,
      );
      process.exit(1);
    }

    return cliConfig;
  } catch (error) {
    console.log(`[${new Date().toISOString()}] Error processing config file:`);
    process.exit(1);
  }
};
