import React from 'react';
import { createRoot } from 'react-dom/client';
// import { BaseWidget } from './base/index';
// import type { State } from './type';
// import registry from './registry';

export const App = async (Widget: React.ElementType) => {
  // // prepare config
  // await registry.init();
  // registry.load({
  //   'widget3': Widget
  // });
  // const state = (window as unknown as {__state__: State}).__state__;

  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(<Widget />);
  }
};
