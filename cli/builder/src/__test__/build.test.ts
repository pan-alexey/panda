import { BaseBuilder, BuilderState, BuilderEvents } from '../';
import webpack from 'webpack';

describe('BaseBuilder', () => {
  test('Error build', async () => {
    const compiler = webpack({});
    const builder = new BaseBuilder(compiler);

    expect(builder.getState()).toEqual({
      status: 'created',
      compiler: {
        err: null,
        stats: null,
      },
      progress: { progress: 0, status: 'created', buildTime: 0, message: '' },
    });

    // -------------------------------------------------------------//
    // Collect events

    const collectEvents: Array<{
      event: BuilderEvents;
      state: BuilderState;
    }> = [];

    builder
      .on('start', (state) => {
        collectEvents.push({
          event: 'start',
          state,
        });
      })
      .on('progress', (state) => {
        collectEvents.push({
          event: 'progress',
          state,
        });
      })
      .on('done', (state) => {
        collectEvents.push({
          event: 'done',
          state,
        });
      })
      .on('closed', (state) => {
        collectEvents.push({
          event: 'closed',
          state,
        });
      });

    // -------------------------------------------------------------//
    await builder.run();

    await builder.close();

    builder.run();

    await builder.close();

    // collectEvents.forEach((item, i) => {
    //   console.log(i, item);
    // });

    console.log(collectEvents.filter((it) => it.event === 'done'));
  });
});
