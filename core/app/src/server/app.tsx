import React from 'react';

export class App {
  private widgets: Record<string, React.ElementType> = {};

  public registerWidget(name: string, element: React.ElementType) {
    this.widgets[name] = element;
  }

  public registerApp() {}

  public async renderHead(): Promise<string> {
    return '';
  }

  public async renderBody(): Promise<string> {
    return '';
  }
}
