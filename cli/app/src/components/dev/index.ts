import path from 'path';
import webpack from 'webpack';
import { WatchBuilder, MultiBuilder, BaseBuilder } from '@panda/tools-builder';
import { getConfig } from '../../webpack/webpack.dev.client';
import { resolvePackageFile } from '../../utils/packages';
import { DevServer } from './server';

import type { MultiBuilderState } from '@panda/tools-builder';
import type { Config } from '@panda/cli-config';

const devServer = new DevServer();
const buildClientPath = path.resolve(process.cwd(), './node_modules/.panda.client.dev');
const buildServerPath = path.resolve(process.cwd(), './node_modules/.panda.client.dev');

const entries = {
  widget: path.resolve(process.cwd(), './src/index.tsx'),
  appClient: resolvePackageFile('@panda/cli-app/module/app.client.tsx'),
  appServer: resolvePackageFile('@panda/cli-app/module/app.server.tsx'),
  bootstrapClient: resolvePackageFile('@panda/cli-app/module/bootstrap.client.ts'),
  bootstrapServer: resolvePackageFile('@panda/cli-app/module/bootstrap.server.ts'),
};

export default async (config: Config) => {
  if (!entries.appClient) {
    throw new Error('CLI APP package error');
  }

  // start dev server
  const port = config.debug.httpPort;
  devServer.ready(false);
  devServer.public(buildClientPath);
  // await devServer.listen(port);

  const clientCompiler = webpack(
    getConfig({
      outputPath: buildClientPath,
      appClient: entries.appClient,
      widgetEntry: entries.widget,
    }),
  );

  const serverCompiler = webpack(
    getConfig({
      outputPath: buildClientPath,
      appClient: entries.appClient,
      widgetEntry: entries.widget,
    }),
  );

  // add hmr client
  new webpack.EntryPlugin(clientCompiler.context, 'webpack-hmr-server/client.js', {
    name: undefined,
  }).apply(clientCompiler);

  const builder = new WatchBuilder(clientCompiler);

  // const builder = new MultiBuilder({
  //   client: new WatchBuilder(clientCompiler),
  //   // server: new WatchBuilder(serverCompiler),
  // });

  builder
    .on('start', (states) => {
      devServer.ready(false);
      console.log('start =>', states.status, states.progress.time, states.progress.progress);
    })
    .on('progress', (states) => {
      console.log('progress =>', states.status, states.progress.time, states.progress.progress);
    })
    .on('done', (states) => {
      console.log('done =>', states.status, states.progress.time, states.progress.progress);
    });
  // const builder = new WatchBuilder(clientCompiler);
  // builder
  //   .on('start', () => {
  //     devServer.ready(false);
  //   })
  //   .on('done', (state) => {
  //     devServer.ready(true);
  //     console.log(state.compiler.stats?.toString());
  //     console.log(`Server run in http://127.0.0.1:${devServer.getPort()}`);

  //     if (state.compiler.stats) {
  //       devServer.sendHmr(state.compiler.stats);
  //       console.log('HRM send');
  //     }
  //   });

  builder.run();
};
