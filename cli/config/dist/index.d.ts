export interface Config {
    name: string;
    debug: {
        httpPort: number;
        getState: (props: {
            url: string;
        }) => Promise<null>;
    };
}
export type CliConfigCallback = () => Promise<Config>;
export declare class CliConfig {
    private callback;
    constructor(callback: CliConfigCallback);
    getConfig(): CliConfigCallback;
}
