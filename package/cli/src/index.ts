#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import * as CliApp from '@panda/cli-app';
import commands from './components/commands';
import buildConfig from './components/buildConfig';
import getConfig from './components/getConfig';
// 1. Build config file to path;
(async () => {
  // 1. STEP
  // Register cli command
  // Get terminal options;
  const commandArgs = await commands();

  // 2. STEP
  // Build config
  const cliConfig = await buildConfig({ entry: commandArgs.config });

  // 3. STEP
  // Evaluate config file, for get config
  const config = await getConfig(cliConfig);

  // 4. STEP
  // Create building application
  const cliApp = new CliApp.App(config);

  await cliApp.run(commandArgs.mode);
})();
