import path from 'path';
import { resolvePackageFile } from '../utils/packages';

export const widgetPath = path.resolve(process.cwd(), './src/index.tsx');
export const clientOutput = path.resolve(process.cwd(), './node_modules/.panda.client.dev');
export const serverOutput = path.resolve(process.cwd(), './node_modules/.panda.server.dev');

export const client = {
  output: clientOutput,
  widget: widgetPath,
  app: resolvePackageFile('@panda/cli-app/module/app.client.tsx'),
  bootstrap: resolvePackageFile('@panda/cli-app/module/bootstrap.client.ts'),
  manifest: path.resolve(clientOutput, './manifest.json'),
};

export const server = {
  output: serverOutput,
  widget: widgetPath,
  app: resolvePackageFile('@panda/cli-app/module/app.server.tsx'),
  bootstrap: resolvePackageFile('@panda/cli-app/module/bootstrap.server.ts'),
};
