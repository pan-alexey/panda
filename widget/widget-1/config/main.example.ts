import config from '@panda/cli';
import type { Config } from '@panda/cli';

export default config(async () => {
  const config: Config = {
    name: 'test',
    // application: {
    //     env: 'dev',
    //     remoteBackend: (widgenName: string) => `http://8.8.8.8/_assets_/server/${widgenName}.tar.gz`, // не рекомендуется писать логику
    //     remoteFrontend: (asset: string, widgetName?: string) => `http://8.8.8.8/_assets_/client/${asset}`, // не рекомендуется писать логику
    // },
    debug: {
      httpPort: 8080,
      remoteBackend: async (props) => {
        // props.widgetName
        // 
        console.log(props.)
        return null;
      }
      // getState: async (axios, url) => {
      //   // url - url запроса
      //   return {};
      // },
      // backendPipe: (original: string, widget: string) => {
      //   return original;
      //   // return 'http://8.8.8.8/_assets_/client/widget.pdp_title@1/module.js'
      // },
      // front: (original: string, widgetName, asset) => {
        
      // }
    }
  };

  console.log('...test...');
  return config;
});

// `
// Widget dev tools work in:

//   [Application] http://127.0.0.1:8080/
//   [client assets]: http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/module.js
//   [server assets]: http://127.0.0.1:8080/_assets_/server/widget.pdp_title@1/module.tar.gz

//   client build: [ok] [224ms]
//   server build: [ok] [224ms]
//   assets build: [ok] [224ms]
// `

// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/module.js => http://8.8.8.8/_assets_/client/widget.pdp_title@1/module.js
// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/module.tar.gz => http://8.8.8.8/_assets_/client/widget.pdp_title@1module.tar.gz
// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/module.tar.gz => http://8.8.8.8/_assets_/widget.pdp_title@1module.tar.gz

// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/stats.json
// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/module.js
// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/js/*.js
// http://127.0.0.1:8080/_assets_/client/widget.pdp_title@1/css/*.js