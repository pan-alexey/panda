import config from '@panda/cli';
import type { Config } from '@panda/cli';

export default config(async () => {
  const config: Config = {
    name: 'test',
    debug: {
      httpPort: 8888,
      getState: async (params) => {
        console.log('params', params.url);
        return null;
      }
    },
  };

  return config;
});
