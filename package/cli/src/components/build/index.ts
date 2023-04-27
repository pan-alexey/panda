import path from 'path';
import fs from 'fs-extra';
import tsconfig from './tsconfig';
import { builder } from './webpack';

export interface ConfigBuilderProps {
  entry: string;
}

export const configBuilder = async (props: ConfigBuilderProps) => {
  const options = {
    entry: path.resolve(process.cwd(), props.entry),
    sources: path.resolve(process.cwd(), './node_modules/.panda.cli'),
    tsconfig: path.resolve(process.cwd(), './node_modules/.panda.cli/tsconfig.json'),
    output: path.resolve(process.cwd(), './node_modules/.panda.cli/build'),
  };

  // clear dir
  await fs.remove(options.output);
  await fs.ensureDir(options.sources);
  await fs.writeFile(options.tsconfig, JSON.stringify(tsconfig));

  const configFile = await builder({
    entry: options.entry,
    output: options.output,
    tsconfig: options.tsconfig,
  });

  return configFile;
};
