/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // Подключаем код виджета c использованием alias
import { App } from '@panda/core-app/src/server/app';

export const Render = () => {
  const app = new App();
  app.registerWidget('widget-1', widget);
  const html = app.renderBody();
  console.log('app', html);
};
