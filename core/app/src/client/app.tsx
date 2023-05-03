import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

export const App = async (Widget: React.ElementType) => {
  const container = document.getElementById('root');
  if (container) {
    if (container.hasChildNodes()) {
      console.log('hydrate');
      hydrateRoot(container, <Widget />);
    } else {
      console.log('render');
      const root = createRoot(container);
      root.render(<Widget />);
    }
  }
};
