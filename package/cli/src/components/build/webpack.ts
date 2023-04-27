import webpack from 'webpack';
import path from 'path';
import { isPackage } from './utils';

export interface BuilderOption {
  entry: string;
  output: string;
  tsconfig: string;
}

export const builder = (options: BuilderOption) => {
  return new Promise((resolve, reject) => {
    const context = process.cwd();

    webpack(
      {
        entry: options.entry,
        mode: 'production',
        devtool: 'source-map',
        target: 'node',
        context,
        resolve: {
          extensions: ['.json', '.ts', '.js', '.tsx'],
          modules: ['node_modules'],
        },
        output: {
          libraryTarget: 'umd',
          path: options.output,
          filename: 'index.js',
        },
        externals: [
          function ({ context, request }, callback) {
            // check if local file import
            if (request && context === process.cwd()) {
              const symbol = request[0];
              if (symbol === '/' || symbol === '.') {
                return callback();
              }
            }
            if (isPackage(request)) {
              return callback(undefined, 'commonjs ' + request);
            }
            return callback();
          },
        ],
        node: {
          global: true,
          __filename: true,
          __dirname: true,
        },
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              options: {
                context,
                allowTsInNodeModules: true,
                onlyCompileBundledFiles: true,
                configFile: options.tsconfig,
              },
            },
          ],
        },
      },
      (err, stats) => {
        if (err || stats?.hasErrors()) {
          if (stats) {
            const statJson = stats.toJson({
              colors: true,
            });
            console.log('Build config error');
            statJson.errors?.forEach((error) => {
              console.log(error.message);
            });
          }
          process.exit(1);
        }
        resolve(path.resolve(options.output, './index.js'));
      },
    );
  });
};
