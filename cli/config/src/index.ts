export interface Config {
  name: string;
  debug: {
    httpPort: number;
    getState: (props: { url: string }) => Promise<null>;
    // remoteBackend?: (props: { widgetName: string }) => Promise<null>;
  };
}

export type CliConfigCallback = () => Promise<Config>;

export class CliConfig {
  private callback: CliConfigCallback;
  constructor(callback: CliConfigCallback) {
    this.callback = callback;
  }

  public getConfig() {
    return this.callback;
  }
}
