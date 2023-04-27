import { Writable } from 'stream';

export class WritableString extends Writable {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chunks: Array<any> = [];
  private data = '';

  getString() {
    return this.data;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _write(chunk, encoding, next) {
    this.chunks.push(chunk);
    next();
  }

  _final(callback: (error?: Error | null | undefined) => void) {
    this.data = Buffer.concat(this.chunks).toString();
    callback();
  }
}
