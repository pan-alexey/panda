import path from 'path';
import { throttle } from 'lodash';
import type { Config } from '@panda/cli-config';
import { WatchBuilder, MultiBuilder, BuilderState } from '@panda/tools-builder';
import { DevServer } from '../server';
import { makeClientDevBuilder, makeServerDevBuilder } from '../../../builders';
import * as terminal from '../terminal';
import * as constants from '../../../builders/constants';

type Builders = {
  clientDev: WatchBuilder;
  serverDev: WatchBuilder;
};

type Builder = MultiBuilder<Builders>;

type State = {
  [key in keyof Builders]: BuilderState;
};

export class AppBuilder {
  private config: Config;
  private builder: Builder;
  private server = new DevServer();

  constructor(config: Config) {
    this.config = config;

    // register dev
    const clientDevBuilder = makeClientDevBuilder();
    const serverDevBuilder = makeServerDevBuilder();
    if (clientDevBuilder === null || serverDevBuilder === null) {
      throw new Error('Error in cli-app package');
    }

    this.builder = new MultiBuilder({
      clientDev: clientDevBuilder,
      serverDev: serverDevBuilder,
    });

    const throttleProcess = throttle(this.process, 50);

    this.builder
      .on('start', (state) => {
        throttleProcess('start', state, this);
      })
      .on('progress', (state) => {
        throttleProcess('progress', state, this);
      })
      .on('done', (state) => {
        throttleProcess('done', state, this);
      });
  }

  private process(status: 'start' | 'progress' | 'done', state: State, ctx: AppBuilder) {
    switch (status) {
      case 'start':
        ctx.start();
        break;
      case 'progress':
        ctx.progress(state);
        break;
      case 'done':
        ctx.done(state);
        break;
      default:
        break;
    }
  }

  private start() {
    terminal.clear();
    this.server.ready(false);
  }

  private progress(state: State) {
    terminal.clear();
    console.log('progress...');
  }

  private async done(state: State) {
    terminal.clear();

    if (state.clientDev.compiler.stats && !state.clientDev.compiler.stats.hasErrors()) {
      this.server.public(constants.client.output);
      this.server._registerManifest(constants.client.manifest);
      this.server.sendHmr(state.clientDev.compiler.stats);
    }

    if (!state.serverDev.compiler.stats?.hasErrors()) {
      console.log('update server');
      await this.server._regiseterSSR(path.resolve(constants.server.output, 'index.js'));
    }

    this.server.ready(true);
    console.log('done');
    console.log(`Server run in http://127.0.0.1:${this.server.getPort()}`);
    console.log(`Local widget in http://127.0.0.1:${this.server.getPort()}/_widget_`);
  }

  public async run() {
    const port = this.config.debug.httpPort;
    await this.server.listen(port);
    await this.builder.run();
  }
}
