import { Command, Option } from 'commander';
const program = new Command();

export interface CommandConfig {
  config: string;
  mode: 'build' | 'dev';
}

export default (): Promise<CommandConfig> =>
  new Promise((resolve) => {
    program.name('panda-cli').description('CLI to build widget').version('1.0.0');
    program
      .command('build')
      .description('Build for prod')
      .addOption(
        new Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'),
      )
      .action((args) => {
        const result: CommandConfig = {
          mode: 'build',
          config: args.config,
        };

        resolve(result);
      });

    program
      .command('dev')
      .description('Run development mode')
      .addOption(
        new Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'),
      )
      .action((args) => {
        const result: CommandConfig = {
          mode: 'dev',
          config: args.config,
        };

        resolve(result);
      });
    program.parse();
  });
