import { Config } from '@panda/cli-config';
import devApp from './components/dev';

export class App {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public async run(mode: 'build' | 'dev') {
    switch (mode) {
      case 'dev':
        await devApp(this.config);
        break;

      default:
        break;
    }
  }
}
