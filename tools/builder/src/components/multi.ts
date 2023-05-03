import { Builder } from '../common/builder';

import type { BuilderState, BuilderStatus, BuilderEvents } from '../common/builder';

export type MultiBuilderState = {
  status: BuilderStatus;
};

export class MultiBuilder<Builders extends Record<string, Builder>> {
  private status: BuilderStatus = 'created';
  private startTime = 0;

  private compilers: {
    [Prop in keyof Builders]: Builder;
  };

  private callbacks: {
    [name in BuilderEvents]: Array<(states: { [Names in keyof Builders]: BuilderState }) => void>;
  } = {
    start: [],
    progress: [],
    done: [],
    closed: [],
  };

  constructor(compilers: Builders) {
    this.status = 'created';
    this.compilers = compilers;
    this.listenCompilers();
  }

  private listenCompilers() {
    Object.keys(this.compilers).forEach((name) => {
      const compiler = this.compilers[name];

      compiler
        .on('start', () => {
          this.processing();
        })
        .on('progress', () => {
          this.processing();
        })
        .on('done', () => {
          this.processing();
        });
    });
  }

  // get state of compilers (call compiler.getState())
  private mapCompilerStates(): { [Names in keyof Builders]: BuilderState } {
    const names = Object.keys(this.compilers) as unknown as Array<keyof Builders>;

    return names.reduce<{ [Names in keyof Builders]: BuilderState }>((acc, name) => {
      acc[name] = this.compilers[name].getState();
      return acc;
    }, {} as { [Names in keyof Builders]: BuilderState });
  }

  private mapCompilerStatuses(): BuilderStatus[] {
    const states = this.mapCompilerStates();
    const names = Object.keys(states) as unknown as Array<keyof Builders>;
    return names.map((name) => states[name].status);
  }

  protected processing(): void {
    // Ignore created statuses
    const statuses = this.mapCompilerStatuses().filter((status) => status !== 'created' && status !== 'closed');
    // not start, progress, done;
    if (statuses.length === 0) {
      return;
    }

    if (
      statuses.includes('start') &&
      (this.status === 'done' || this.status === 'created' || this.status === 'closed')
    ) {
      this.emit('start');
      return;
    }

    if (statuses.length === statuses.filter((status) => status === 'done').length) {
      this.emit('done');
      return;
    }

    this.emit('progress');
  }

  private emit(status: BuilderEvents): void {
    this.status = status;
    this.callbacks[status].forEach((fn) => fn(this.mapCompilerStates()));
  }

  public on(
    event: BuilderEvents,
    fn: (states: { [Names in keyof Builders]: BuilderState }) => void,
  ): MultiBuilder<Builders> {
    this.callbacks[event].push(fn);
    return this;
  }

  public async run(): Promise<{ [Names in keyof Builders]: BuilderState }> {
    this.processing();

    const names = Object.keys(this.compilers) as unknown as Array<keyof Builders>;
    const promises = names.map((name: keyof Builders) => this.compilers[name].run());
    const items = await Promise.all(promises);
    return names.reduce<{ [Names in keyof Builders]: BuilderState }>((acc, name, index) => {
      acc[name] = items[index];
      return acc;
    }, {} as { [Names in keyof Builders]: BuilderState });
  }

  public async close(): Promise<{ [Names in keyof Builders]: BuilderState }> {
    const names = Object.keys(this.compilers) as unknown as Array<keyof Builders>;
    const items = await Promise.all(names.map((name: keyof Builders) => this.compilers[name].close()));

    this.processing();

    return names.reduce<{ [Names in keyof Builders]: BuilderState }>((acc, name, index) => {
      acc[name] = items[index];
      return acc;
    }, {} as { [Names in keyof Builders]: BuilderState });
  }
}
