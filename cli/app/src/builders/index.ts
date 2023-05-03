import webpack from 'webpack';
import { WatchBuilder } from '@panda/tools-builder';
import * as constants from './constants';
import webpackDevClient from '../webpack/webpack.dev.client';
import webpackDevServer from '../webpack/webpack.dev.server';

export const makeClientDevBuilder = (): WatchBuilder | null => {
  const { client } = constants;

  if (!client.app) {
    return null;
  }

  const webpackConfig = webpackDevClient({
    outputPath: client.output,
    app: client.app,
    widgetEntry: client.widget,
    manifestJson: client.manifest,
  });

  const compiler = webpack(webpackConfig);
  // add hmr
  new webpack.EntryPlugin(compiler.context, 'webpack-hmr-server/client.js', {
    name: undefined,
  }).apply(compiler);

  return new WatchBuilder(compiler, {
    ignored: [constants.client.output],
  });
};

export const makeServerDevBuilder = (): WatchBuilder | null => {
  const { server } = constants;

  if (!server.app) {
    return null;
  }

  const webpackConfig = webpackDevServer({
    outputPath: server.output,
    app: server.app,
    widgetEntry: server.widget,
  });
  const compiler = webpack(webpackConfig);
  return new WatchBuilder(compiler, {
    ignored: [server.output],
  });
};
