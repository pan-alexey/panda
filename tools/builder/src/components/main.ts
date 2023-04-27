import type webpack from 'webpack';
import { Builder, BuilderState } from '../common/builder';

export class BaseBuilder extends Builder {
  constructor(compiler: webpack.Compiler) {
    super(compiler);
  }

  public run(): Promise<BuilderState> {
    return new Promise((resolve) => {
      this.startHandler();

      this.compiler.hooks.afterDone.tap('builder', (stats) => {
        this.doneHandler(stats);
      });

      this.compiler.run((err) => {
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
        this.compiler.close(() => {
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
