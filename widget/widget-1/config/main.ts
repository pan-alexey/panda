// import type { Config } from '@panda/core';

const data = [
  { name: 'widget.widget4', props: {}, important: true },
  { name: 'widget.widget1', props: { test: 1 } },
  {
    name: 'context.context1',
    props: {},
    children: [
      { name: 'widget.widget1', props: { test: 2 } },
      { name: 'widget.widget2', props: { test: 3 }, children: [{ name: 'widget.widget1', props: { test: 4 } }] },
    ],
  },
  { name: 'widget.widget1', props: {} },
];


const config = {
  name: "widget.navbar@1.0",
  data: async () => {
    return data;
  },
  // umd: [],
  // shared: [],
  // todo
};

export default config;
