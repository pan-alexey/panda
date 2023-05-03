import os from 'os';

export const breakLine = () => {
  newLine();
  newLine();
};

export const newLine = () => {
  process.stdout.write(os.EOL);
};

export const clear = () => {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
};
