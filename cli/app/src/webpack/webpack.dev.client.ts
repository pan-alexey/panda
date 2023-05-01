import webpack from 'webpack';
import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { AssetsManifestPlugin } from './plugins.dev/assetsManifestPlugin';
import type { Configuration as WebpackConfiguration } from 'webpack';

const { ModuleFederationPlugin } = webpack.container;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@panda/core-app/webpack/shared.js')

const appName = 'application'; // Application is singleton

export interface ConfigProps {
  outputPath: string;
  widgetEntry: string;
  appClient: string;
  manifestJson: string;
}

export const getConfig = (props: ConfigProps): WebpackConfiguration => {
  const config: WebpackConfiguration = {
    target: 'web',
    devtool: 'source-map',
    mode: 'development',
    plugins: [
      new AssetsManifestPlugin({
        statsOptions: {
          outputPath: false,
          cached: false,
          cachedAssets: false,
          chunks: false,
          chunkModules: false,
          chunkOrigins: false,
          modules: false,
          nestedModules: false,
          reasons: false,
          relatedAssets: false,
        },
        output: props.manifestJson,
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
      new ModuleFederationPlugin({
        name: appName,
        shared,
      }),
    ],
    context: process.cwd(),
    entry: {
      index: props.appClient,
    },
    output: {
      chunkLoadingGlobal: `webpack_chunks[${appName}]`,
      uniqueName: appName,
      publicPath: 'auto',
      chunkFilename: () => {
        return '[name].[contenthash].js';
      },
      clean: true,
      path: props.outputPath,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~widget$': props.widgetEntry, // используем alias для подключения виджета ???
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      ],
    },
  };

  return config;
};
