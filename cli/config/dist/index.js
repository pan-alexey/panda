"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliConfig = void 0;
class CliConfig {
    callback;
    constructor(callback) {
        this.callback = callback;
    }
    getConfig() {
        return this.callback;
    }
}
exports.CliConfig = CliConfig;
