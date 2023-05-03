import fs from 'fs-extra';
import * as webpack from 'webpack';

// const isCSS = (file: string): boolean => /\.css(\?[^.]+)?$/.test(file);

const getAssetsCSS = (assets: Array<webpack.Asset>): Array<string> => {
  const isCSS = (file: string): boolean => /\.css(\?[^.]+)?$/.test(file);
  const result: Array<string> = [];
  assets.forEach((asset: webpack.Asset) => {
    //  disable not js and hot-updates chunks
    if (isCSS(asset.name)) {
      result.push(asset.name);
    }
  });

  return result;
};

const getCSSChunks = (
  stats: Record<string, webpack.StatsChunkGroup>,
): {
  initialCSS: Array<string>;
  allCSS: Array<string>;
} => {
  const allCSS: Array<string> = getAssetsJS(stats.assets as Array<webpack.Asset>);

  let initialCSS: Array<string> = [];
  const entrypoints = Object.keys(stats.entrypoints);
  for (let i = 0; i < entrypoints.length; i++) {
    const entrypoint = stats.entrypoints[entrypoints[i]];
    const css = getAssetsCSS(entrypoint.assets as Array<webpack.Asset>);
    initialCSS = initialCSS.concat(css);
  }

  return {
    initialCSS: [...new Set(initialCSS)],
    allCSS: [...new Set(allCSS)],
  };
};

const getAssetsJS = (assets: Array<webpack.Asset>): Array<string> => {
  const isJS = (file: string) => /\.js(\?[^.]+)?$/.test(file);
  const result: Array<string> = [];
  assets.forEach((asset: webpack.Asset) => {
    //  disable not js and hot-updates chunks
    if (isJS(asset.name) && !asset.name.includes('hot-update')) {
      result.push(asset.name);
    }
  });

  return result;
};

const getJSChunks = (
  stats: Record<string, webpack.StatsChunkGroup>,
): {
  initialJS: Array<string>;
  allJS: Array<string>;
} => {
  const allJS: Array<string> = getAssetsJS(stats.assets as Array<webpack.Asset>);

  let initialJS: Array<string> = [];
  const entrypoints = Object.keys(stats.entrypoints);
  for (let i = 0; i < entrypoints.length; i++) {
    const entrypoint = stats.entrypoints[entrypoints[i]];
    const js = getAssetsJS(entrypoint.assets as Array<webpack.Asset>);
    initialJS = initialJS.concat(js);
  }

  return {
    initialJS: [...new Set(initialJS)],
    allJS: [...new Set(allJS)],
  };
};

export class AssetsManifestPlugin {
  private statsOptions: webpack.StatsOptions;
  private output: string;

  constructor(opts: { statsOptions: webpack.StatsOptions; output: string }) {
    this.statsOptions = opts.statsOptions || {};
    this.output = opts.output;
  }

  apply(compiler: webpack.Compiler) {
    // IMportant use afterEmit hook
    compiler.hooks.afterEmit.tapAsync('custom-assets-manifest-plugin', (compilation, next) => {
      const stats = compilation.getStats().toJson(this.statsOptions);

      // Build simple manifest
      const manifest = {
        js: getJSChunks(stats),
        css: getCSSChunks(stats),
        stats,
      };

      const output = this.output;
      fs.writeJson(output, manifest, (err) => {
        next();
        if (err) return console.error(err);
      });
    });
  }
}
