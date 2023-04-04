import type webpack from 'webpack';
import { Builder, BuilderState } from '../common/builder';

export class BaseBuilder extends Builder {
  constructor(compiler: webpack.Compiler) {
    super(compiler);
  }

  public run(): Promise<BuilderState> {
    return new Promise((resolve) => {
      // add begin
      this.compiler.run((err, stats) => {
        this.compilerHandler(err, stats);
        resolve(this.getState());
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
