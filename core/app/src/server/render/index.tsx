import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { WritableString } from './WritableString';

export const renderComponent = (Component: React.ReactElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    const writableString = new WritableString();
    const { pipe } = renderToPipeableStream(Component, {
      onAllReady() {
        pipe(writableString);
      },
      onError(error) {
        reject(error);
      },
    });
    writableString.on('finish', () => {
      resolve(writableString.getString());
    });
  });
};
