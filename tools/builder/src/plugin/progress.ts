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
  message: string;
  moduleProgress?: string;
  activeModules?: string;
  moduleName?: string;
}

type ProgressCallback = (progress: ProgressState) => void;

export class CustomProgressPlugin {
  private progressEnable = true;
  private callbacks: ProgressCallback[] = [];
  private startTime = 0;

  constructor(compiler: webpack.Compiler) {
    new compiler.webpack.ProgressPlugin(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (progress: number, message: string, moduleProgress?: string, activeModules?: string, moduleName?: string) => {
        this.handle({
          progress,
          message,
          moduleProgress,
          activeModules,
          moduleName,
        });
      },
    ).apply(compiler);
  }

  private handle(props: Omit<ProgressState, 'status'>) {
    if (!this.progressEnable) return;

    const { progress } = props;
    let status: ProgressStatus = 'created';

    switch (true) {
      case progress === 0:
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
        status = 'done';
        break;
      default:
        break;
    }

    // apply callbacks
    this.callbacks.forEach((fn) =>
      fn({
        status,
        ...props,
      }),
    );

    if (status === 'done') {
      this.startTime = 0;
    }
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
