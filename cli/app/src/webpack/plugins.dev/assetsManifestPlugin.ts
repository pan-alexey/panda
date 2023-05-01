import fs from 'fs-extra';
import * as webpack from 'webpack';

// const isJS = file => /\.js(\?[^.]+)?$/.test(file);
// const isCSS = file => /\.css(\?[^.]+)?$/.test(file);

export class AssetsManifestPlugin {
  private statsOptions: webpack.StatsOptions;
  private output: string;

  constructor(opts: { statsOptions: webpack.StatsOptions; output: string }) {
    this.statsOptions = opts.statsOptions || {};
    this.output = opts.output;
  }

  apply(compiler: webpack.Compiler) {
    // IMportant use afterEmit hook
    compiler.hooks.afterEmit.tapAsync('assets-manifest-plugin', (compilation, next) => {
      const stats = compilation.getStats().toJson(this.statsOptions);
      const output = this.output;

      // TODO MAKE MANIFEST
      const manifest = stats;
      fs.writeJson(output, manifest, (err) => {
        next();
        if (err) return console.error(err);
      });
    });
  }
}
