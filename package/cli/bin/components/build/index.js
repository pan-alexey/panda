"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configBuilder = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const tsconfig_1 = __importDefault(require("./tsconfig"));
const webpack_1 = require("./webpack");
const configBuilder = async (props) => {
    const options = {
        entry: path_1.default.resolve(process.cwd(), props.entry),
        sources: path_1.default.resolve(process.cwd(), './node_modules/.panda.cli'),
        tsconfig: path_1.default.resolve(process.cwd(), './node_modules/.panda.cli/tsconfig.json'),
        output: path_1.default.resolve(process.cwd(), './node_modules/.panda.cli/build'),
    };
    await fs_extra_1.default.remove(options.output);
    await fs_extra_1.default.ensureDir(options.sources);
    await fs_extra_1.default.writeFile(options.tsconfig, JSON.stringify(tsconfig_1.default));
    const configFile = await (0, webpack_1.builder)({
        entry: options.entry,
        output: options.output,
        tsconfig: options.tsconfig,
    });
    return configFile;
};
exports.configBuilder = configBuilder;
