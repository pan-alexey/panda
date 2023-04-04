import type webpack from 'webpack';
import { CustomProgressPlugin } from '../plugin/progress';
import type { ProgressState } from '../plugin/progress';

export type BuilderStatus = 'created' | 'start' | 'progress' | 'done' | 'closed';
export type BuilderEvents = 'start' | 'progress' | 'done' | 'closed';

export type CompilerState = {
  stats: null | webpack.Stats;
  err: null | Error | Error[];
};

export type BuilderState = {
  status: BuilderStatus;
  compiler: CompilerState;
  progress: ProgressState;
};

export type BuilderCallback = (state: BuilderState) => void;

export abstract class Builder {
  protected compiler: webpack.Compiler;
  protected progressPlugin: CustomProgressPlugin;

  private status: BuilderStatus = 'created';

  private compilerState: CompilerState = {
    stats: null,
    err: null,
  };

  private progressState: ProgressState = {
    progress: 0,
    status: 'created',
    buildTime: 0,
    message: '',
  };

  private callbacks: {
    [name in BuilderEvents]: Array<BuilderCallback>;
  } = {
    start: [],
    progress: [],
    done: [],
    closed: [],
  };

  constructor(compiler: webpack.Compiler) {
    this.compiler = compiler;
    this.progressPlugin = new CustomProgressPlugin(compiler);
    this.progressProcessing();
  }

  public getCompiler(): webpack.Compiler {
    return this.compiler;
  }

  public getState(): BuilderState {
    return {
      status: this.status,
      progress: this.progressState,
      compiler: this.compilerState,
    };
  }

  public on(name: BuilderEvents, callback: BuilderCallback): Builder {
    this.callbacks[name].push(callback);
    return this;
  }

  public abstract run(): Promise<BuilderState>;

  public abstract close(): Promise<BuilderState>;

  protected compilerHandler(err: Error | null = null, stats: webpack.Stats | null = null): void {
    let stateError: Error | Error[] | null = null;
    if (err) {
      stateError = err;
    } else if (stats?.hasErrors()) {
      stateError = new Error(
        stats.toString({
          colors: true,
        }),
      );
    }

    this.compilerState = {
      err: stateError,
      stats,
    };

    this.emitDone();
  }

  protected closeHandler(): void {
    this.emitClose();
  }

  private progressProcessing() {
    this.progressPlugin.on((progressState) => {
      this.progressState = progressState;

      switch (progressState.status) {
        case 'start':
          this.emitStart();
          break;
        case 'compiling':
        case 'building':
        case 'sealing':
        case 'emit':
        case 'afterEmit':
        case 'done':
          this.emitProgress();
          break;
      }
    });
  }

  // Emit methods
  private emitStart(): void {
    this.status = 'start';
    this.compilerState = {
      err: null,
      stats: null,
    };

    // emit start callbacks
    this.callbacks.start.forEach((fn) => fn(this.getState()));
  }

  private emitProgress(): void {
    this.status = 'progress';
    this.compilerState = {
      err: null,
      stats: null,
    };

    // emit progress callbacks
    this.callbacks.progress.forEach((fn) => fn(this.getState()));
  }

  private emitDone(): void {
    this.status = 'done';

    // emit done callbacks
    this.callbacks.done.forEach((fn) => fn(this.getState()));
  }

  private emitClose(): void {
    this.status = 'closed';
    this.compilerState = {
      err: null,
      stats: null,
    };

    this.progressState = {
      status: 'closed',
      message: '',
      progress: 1,
      buildTime: 0,
    };
    // emit closed callbacks
    this.callbacks.closed.forEach((fn) => fn(this.getState()));
  }
}
