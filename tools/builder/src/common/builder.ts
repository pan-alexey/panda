import type webpack from 'webpack';
import { CustomProgressPlugin } from '../plugin/progress';
import type { ProgressState } from '../plugin/progress';

export type BuilderStatus = 'created' | 'start' | 'progress' | 'done' | 'closed' | 'error';
export type BuilderEvents = 'start' | 'progress' | 'done' | 'closed';

export type CompilerState = {
  stats: null | webpack.Stats;
  err: null | Error | Error[];
};

export interface BuilderProgress extends ProgressState {
  time: number;
}

export type BuilderState = {
  status: BuilderStatus;
  compiler: CompilerState;
  progress: BuilderProgress;
};

export type BuilderCallback = (state: BuilderState) => void | Promise<void>;

export abstract class Builder {
  protected compiler: webpack.Compiler;
  protected progressPlugin: CustomProgressPlugin;
  private startTime = 0;

  private state: BuilderState = {
    status: 'created',
    progress: {
      time: 0,
      progress: 0,
      status: 'created',
      message: '',
    },
    compiler: {
      stats: null,
      err: null,
    },
  };

  private callbacks: {
    [name in BuilderEvents]: Array<BuilderCallback>;
  } = {
    start: [],
    progress: [],
    done: [],
    closed: [],
  };

  private onceCallbacks: {
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
    return this.state; // todo deepClone;
  }

  public once(name: BuilderEvents, callback: BuilderCallback): Builder {
    this.onceCallbacks[name].push(callback);
    return this;
  }

  public on(name: BuilderEvents, callback: BuilderCallback): Builder {
    this.callbacks[name].push(callback);
    return this;
  }

  public abstract run(): Promise<BuilderState>;

  public abstract close(): Promise<BuilderState>;

  protected doneHandler(stats: webpack.Stats): void {
    this.state = {
      status: 'done',
      progress: {
        time: Date.now() - this.startTime,
        progress: 1,
        status: 'done',
        message: '',
      },
      compiler: {
        stats: stats,
        err: null,
      },
    };
    this.startTime = 0;
    this.emitCallback('done');
  }

  protected startHandler(): void {
    this.state = {
      status: 'start',
      progress: {
        time: 0,
        progress: 0,
        status: 'start',
        message: '',
      },
      compiler: {
        stats: null,
        err: null,
      },
    };
    this.startTime = Date.now();
    this.emitCallback('start');
  }

  protected closeHandler(): void {
    this.state = {
      status: 'closed',
      progress: {
        time: 0,
        progress: 1,
        status: 'closed',
        message: '',
      },
      compiler: {
        stats: null,
        err: null,
      },
    };
    this.startTime = 0;
    this.emitCallback('closed');
  }

  protected errorHandler(err: Error): void {
    this.state = {
      status: 'error',
      progress: {
        time: 0,
        progress: 1,
        status: 'done',
        message: '',
      },
      compiler: {
        stats: null,
        err: err,
      },
    };

    this.emitCallback('done');
  }

  private emitOnceCallback(name: BuilderEvents) {
    const callbacks = [...this.onceCallbacks[name]];
    this.onceCallbacks[name] = [];
    callbacks.forEach((fn) => fn(this.getState()));
  }

  private emitCallback(name: BuilderEvents) {
    this.emitOnceCallback(name); // handle once callback
    const callbacks = this.callbacks[name];
    callbacks.forEach((fn) => fn(this.getState()));
  }

  private progressProcessing() {
    this.progressPlugin.on((progressState) => {
      this.emitProgress(progressState);
    });
  }

  private emitProgress(progressState: ProgressState): void {
    this.state = {
      status: 'progress',
      progress: {
        time: Date.now() - this.startTime,
        ...progressState,
      },
      compiler: {
        stats: null,
        err: null,
      },
    };
    this.emitCallback('progress');
  }
}
