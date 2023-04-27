import { Builder } from '../common/builder';
import type { BuilderState, BuilderStatus, BuilderEvents } from '../common/builder';

export type MultiBuilderState = {
  status: BuilderStatus;
};

export class MultiBuilder<Builders extends Record<string, Builder>> {
  private status: BuilderStatus = 'created';

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
    const names = Object.keys(this.compilers) as unknown as Array<keyof Builders>;
    names.forEach((name: keyof Builders) => {
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

  public processing(): void {
    // Ignore created statuses
    const statuses = this.mapCompilerStatuses().filter((status) => status !== 'created');

    const statusesWithoutClosed = statuses.filter((status) => status !== 'closed');
    // All compilers are closed
    if (statusesWithoutClosed.length === 0) {
      this.emit('closed');
      return;
    }

    const statusesWithDone = statusesWithoutClosed.filter((status) => status === 'done');
    // All compilers are done
    if (statusesWithDone.length === statusesWithoutClosed.length) {
      this.emit('done');
      return;
    }

    // If prev status is not progress, set start
    if (this.status !== 'progress') {
      this.emit('start');
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
    const names = Object.keys(this.compilers) as unknown as Array<keyof Builders>;

    const promises = names.map(async (name: keyof Builders) => await this.compilers[name].run());

    const items = await Promise.all(promises);

    return names.reduce<{ [Names in keyof Builders]: BuilderState }>((acc, name, index) => {
      acc[name] = items[index];
      return acc;
    }, {} as { [Names in keyof Builders]: BuilderState });
  }

  public async close(): Promise<{ [Names in keyof Builders]: BuilderState }> {
    const names = Object.keys(this.compilers) as unknown as Array<keyof Builders>;
    const items = await Promise.all(names.map((name: keyof Builders) => this.compilers[name].close()));

    return names.reduce<{ [Names in keyof Builders]: BuilderState }>((acc, name, index) => {
      acc[name] = items[index];
      return acc;
    }, {} as { [Names in keyof Builders]: BuilderState });
  }
}
