# common-builder

Пакет является фассадом, для webpack.
Основная задача, данного пакета - добавить возможность получения прогресса сброки

Дополнительная возможность - это обьединять процесс сборки.

## API для сборшиков
## Все сборщики предоставляют единный API для работы

### Список пубиличных методов (BuilderEvents):
* run - Начало процесса сборки.
* close - Закрыть сборку.

### Список событий (BuilderEvents):
* start - Начало процесса сборки.
* progress - Любое событие в прогрессе сборки.
* done - сборка завершена (событие не зависит от статуса сборки. В случае не спешной сборки, событие будет вызвано)
* closed - сборка закрыта


Пример использования c **BaseBuilder**:
```ts
import webpack from 'webpack';
import { BaseBuilder, CompilerState } from '@panda/common-builder';

const builder = new BaseBuilder(webpack({/*...*/}));
builder.on('start', (state: BuilderState) => {
  // ...
})
.on('progress', (state: BuilderState) => {
  // ...
})
.on('done', (state: BuilderState) => {
  // ...
});

```


Пример использования c **WatchBuilder**:
```ts
import webpack from 'webpack';
import { WatchBuilder, BaseBuilder, BuilderState } from '@panda/common-builder';

const builder = new WatchBuilder(webpack({/*...*/}));
builder.on('start', (state: BuilderState) => {
  // ...
})
.on('progress', (state: BuilderState) => {
  // ...
})
.on('done', (state: BuilderState) => {
  // ...
});

```


Пример использования c **MultiBuilder**:
```ts
import webpack from 'webpack';
import { WatchBuilder, BaseBuilder, MultiBuilder, BuilderState } from '@panda/common-builder';

const builderA = new WatchBuilder(webpack({/*...*/}));
const builderB = new BaseBuilder(webpack({/*...*/}));

const multiWatch = new MultiBuilder({
  builderA,
  builderB,
});


multiWatch.on('start', (state: BuilderState) => {
  // ...
})
.on('progress', (state: BuilderState) => {
  // ...
})
.on('done', (state: BuilderState) => {
  // ...
});
```



