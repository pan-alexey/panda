"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_config_1 = require("@panda/cli-config");
const index_1 = require("./build/index");
exports.default = async (props) => {
    console.log(`[${new Date().toISOString()}] Building config (${props.entry})`);
    const configFile = await (0, index_1.configBuilder)({
        entry: props.entry,
    });
    try {
        const cliConfig = require(configFile).default;
        if (!(cliConfig instanceof cli_config_1.CliConfig)) {
            console.log(`[${new Date().toISOString()}] Not valid config file. Config file must be return default export by config function;`);
            process.exit(1);
        }
        return cliConfig;
    }
    catch (error) {
        console.log(`[${new Date().toISOString()}] Error processing config file:`);
        process.exit(1);
    }
};
