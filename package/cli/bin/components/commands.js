"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
exports.default = () => new Promise((resolve) => {
    program.name('panda-cli').description('CLI to build widget').version('1.0.0');
    program
        .command('build')
        .description('Build for prod')
        .addOption(new commander_1.Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'))
        .action((args) => {
        const result = {
            mode: 'build',
            config: args.config,
        };
        resolve(result);
    });
    program
        .command('dev')
        .description('Run development mode')
        .addOption(new commander_1.Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'))
        .action((args) => {
        const result = {
            mode: 'dev',
            config: args.config,
        };
        resolve(result);
    });
    program.parse();
});
