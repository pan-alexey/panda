import React from 'react';
import { renderComponent } from './render';

export class App {
  private widgets: Record<string, React.ElementType> = {};

  public registerWidget(name: string, element: React.ElementType) {
    this.widgets[name] = element;
  }

  public async renderHead(): Promise<string> {
    return '';
  }

  public async renderBody(): Promise<string> {
    const Component = this.widgets['widget-1'] || <></>;
    const html = renderComponent(<Component />);
    return html;
  }
}
