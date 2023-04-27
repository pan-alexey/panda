"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = void 0;
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const builder = (options) => {
    return new Promise((resolve, reject) => {
        const context = process.cwd();
        (0, webpack_1.default)({
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
                    if (request && context === process.cwd()) {
                        const symbol = request[0];
                        if (symbol === '/' || symbol === '.') {
                            return callback();
                        }
                    }
                    if ((0, utils_1.isPackage)(request)) {
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
        }, (err, stats) => {
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
            resolve(path_1.default.resolve(options.output, './index.js'));
        });
    });
};
exports.builder = builder;
