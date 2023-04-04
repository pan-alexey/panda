import type webpack from 'webpack';
import { Builder, BuilderState } from '../common/builder';

interface WatchOptions {
  aggregateTimeout?: number;
  followSymlinks?: boolean;
  ignored?: string | RegExp | string[];
  poll?: number | boolean;
}

const DEFAULT_WATCH_OPTIONS: WatchOptions = {
  aggregateTimeout: 10,
  poll: 10,
};

export class WatchBuilder extends Builder {
  constructor(compiler: webpack.Compiler) {
    super(compiler);
  }

  public run(): Promise<BuilderState> {
    return new Promise((resolve) => {
      this.compiler.watch(DEFAULT_WATCH_OPTIONS, (err, stats) => {
        this.compilerHandler(err, stats);
        resolve(this.getState());
      });
    });
  }

  public close(): Promise<BuilderState> {
    return new Promise((resolve) => {
      const { status } = this.getState();
      const callback = () => {
        this.compiler.watching.close(() => {
          this.closeHandler();
          resolve(this.getState());
        });
      };

      if (status === 'start' || status === 'progress') {
        this.compiler.hooks.afterDone.tap('builder', () => {
          callback();
        });

        return;
      }

      callback();
    });
  }
}
