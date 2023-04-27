"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (cliConfig) => {
    try {
        const callback = cliConfig.getConfig();
        console.log(`[${new Date().toISOString()}] Calling config function`);
        const config = await callback();
        return config;
    }
    catch (error) {
        console.log(`[${new Date().toISOString()}] Error execute config:`);
        console.log(error);
        process.exit(1);
    }
};
