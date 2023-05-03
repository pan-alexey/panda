import type webpack from 'webpack';
import { Builder, BuilderState } from '../common/builder';

interface WatchOptions {
  aggregateTimeout?: number;
  followSymlinks?: boolean;
  ignored?: string | RegExp | string[];
  poll?: number | boolean;
}

export class WatchBuilder extends Builder {
  private watchOptions: WatchOptions;

  constructor(compiler: webpack.Compiler, watchOptions: WatchOptions = {}) {
    super(compiler);

    this.watchOptions = watchOptions;
  }

  public run(): Promise<BuilderState> {
    return new Promise((resolve) => {
      this.startHandler();

      this.compiler.hooks.afterDone.tap('builder', (stats) => {
        this.doneHandler(stats);
      });

      // when change after start
      this.compiler.hooks.invalid.tap('builder', () => {
        this.startHandler();
      });

      // add ignored path
      this.compiler.watch(this.watchOptions, (err) => {
        if (err) {
          this.errorHandler(err);
        }
      });

      this.once('done', (state) => {
        resolve(state);
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
