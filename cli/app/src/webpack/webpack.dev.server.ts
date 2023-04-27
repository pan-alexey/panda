import type { Configuration as WebpackConfiguration } from 'webpack';
import * as path from 'path';
import webpack from 'webpack';

const { ModuleFederationPlugin } = webpack.container;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@panda/core-app/webpack/shared.js');

const appName = 'application'; // Application is singleton

export default (): WebpackConfiguration => {
  const config: WebpackConfiguration = {
    entry: {
      index: path.resolve('./src/server/index.tsx'),
    },
    mode: 'production',
    devtool: 'source-map',
    target: 'node',
    output: {
      uniqueName: appName, // in package
      libraryTarget: 'umd',
      path: path.resolve('./dist/server'),
      filename: 'index.js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~': path.resolve('src'),
      },
    },
    plugins: [
      new ModuleFederationPlugin({
        name: appName,
        shared,
        library: { type: 'commonjs-module' },
      }),
    ],
    optimization: {
      minimize: false,
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
