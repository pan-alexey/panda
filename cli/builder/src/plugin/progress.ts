import type webpack from 'webpack';

/*
https://medium.com/@artempetrovcode/how-webpack-progressplugin-works-7e7301a3d919
*/

export type ProgressStatus =
  | 'created'
  | 'start'
  | 'compiling'
  | 'building'
  | 'sealing'
  | 'emit'
  | 'afterEmit'
  | 'done'
  | 'closed';

export interface ProgressState {
  status: ProgressStatus;
  progress: number;
  buildTime: number;
  message: string;
}

type ProgressCallback = (progress: ProgressState) => void;

export class CustomProgressPlugin {
  private progressEnable = true;
  private callbacks: ProgressCallback[] = [];
  private startTime = 0;
  private suppress = true;

  constructor(compiler: webpack.Compiler) {
    new compiler.webpack.ProgressPlugin((progress: number, message: string) => {
      this.handle(progress, message);
    }).apply(compiler);
  }

  private handle(progress: number, message = '') {
    if (!this.progressEnable) return;

    // done must bo after start
    if (this.suppress && progress !== 0) {
      return;
    }

    // start must bo after done or create
    if (!this.suppress && progress === 0) {
      return;
    }

    let status: ProgressStatus = 'created';
    switch (true) {
      case progress === 0:
        this.suppress = false;
        this.startTime = Date.now();
        status = 'start';
        break;

      case progress < 0.1:
        status = 'compiling';
        break;

      case progress < 0.7:
        status = 'building';
        break;

      case progress < 0.95:
        status = 'sealing';
        break;

      case progress < 0.98:
        status = 'emit';
        break;

      case progress < 1:
        status = 'afterEmit';
        break;

      // done
      case progress === 1:
        this.suppress = true;
        status = 'done';
        break;
      default:
        break;
    }

    // apply callbacks
    this.callbacks.forEach((fn) =>
      fn({
        status,
        message,
        progress,
        buildTime: Date.now() - this.startTime,
      }),
    );
  }

  public isEnable() {
    return this.isEnable;
  }

  public enable() {
    this.progressEnable = false;
  }

  public disable() {
    this.progressEnable = true;
  }

  public on(callback: ProgressCallback) {
    this.callbacks.push(callback);
    return this;
  }
}
