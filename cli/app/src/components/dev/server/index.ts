import * as http from 'http';
import { AddressInfo } from 'net';
import webpack from 'webpack';
import express, { Express, Request, Response, NextFunction } from 'express';
import { createHotServer } from 'webpack-hmr-server';
import fs from 'fs-extra';

export class DevServer {
  private expressApp: Express = express();
  private server = http.createServer(this.expressApp);
  private hotServer = createHotServer(this.server);
  private isReady = false;
  private port = 0;

  private manifest: webpack.StatsCompilation = {};

  constructor() {
    this.useReadyMiddleware();
    this.registerStaticDev();
  }

  private useReadyMiddleware(): void {
    this.expressApp.use((req: Request, res: Response, next: NextFunction) => {
      if (this.isReady) {
        return next();
      }
      const timer = setInterval(() => {
        if (this.isReady) {
          clearInterval(timer);
          next();
        }
      }, 100);

      req.on('close', () => {
        clearInterval(timer);
      });
    });
  }

  private registerStaticDev() {
    this.expressApp.get('/', (req, res) => {
      const assets = this.manifest.assets || [];
      const headScript = assets
        .map((asset) => {
          return ` <script defer src="/${asset.name}"></script>`;
        })
        .join('');

      res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>MF</title>
          ${headScript}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>`);
    });
  }

  public async _registerManifest(jsonPath: string) {
    try {
      this.manifest = (await fs.readJSON(jsonPath)) as webpack.StatsCompilation;
    } catch (error) {}
  }

  public sendHmr(stats: webpack.Stats) {
    this.hotServer.reloadModules({ client: stats });
  }

  public ready(status: boolean) {
    this.isReady = status;
    // may be need close active connection
  }

  public public(path: string) {
    // this.isReady = status;
    this.expressApp.use(express.static(path));
  }

  public getPort() {
    return this.port;
  }

  public async listen(port: number) {
    // port can be random if use port = 0
    this.port = await new Promise((resolve, reject) => {
      let startFinished = false;
      this.server.listen(port, () => {
        const address = this.server.address();
        if (!address) {
          return reject();
        }
        startFinished = true;
        resolve((address as AddressInfo).port);
      });
      this.server.once('error', (err) => {
        if (!startFinished && err) {
          reject(err);
        }
      });
    });
  }
}
