# Inroduction

Make pluginable applications.

# APIs

```js
const { runPluginAnything } = require('plugin-anything');

runPluginAnything(
    {
        // Array< string >
        searchList: [
            // string: absolute folder path
        ],

        // Array< string | FunctionContructor | Array<string | FunctionContructor, object> >
        plugins: [
            // string: plugin name
            // FunctionContructor: Plugin Constructor
            // Array: [ string | FunctionContructor, options object ]
        ],
    }, 
    {
        // init something like: hooks, customs config
        async init({ hooks, Events, customs }) {
            hooks.done = new Events();
            customs.myConfig = {};
        },

        // run lifecycle
        async lifecycle({ hooks, Events, customs }) {
            // flush hooks
            await hooks.done.flush('waterfall');

            // do something
            // ...
            // console.log(customs.myConfig);
        }
    }
);
```

# Demo

```js
class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply({ hooks, customs }) {
        hooks.done.tap('my plugin A', async () => {
            console.log('my plugin A hook run');
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply({ hooks, customs }) {
        hooks.done.tap('my plugin B', async () => {
            console.log('my plugin B hook run');
        });
    }
}

runPluginAnything(
    {
        plugins: [
            MyPlugin__A,

            [ MyPlugin__B, { name: 'bbb' } ]
        ]
    }, 
    {
        async init({ hooks, Events, customs }) {
            hooks.done = new Events();
        },
        async lifecycle({ hooks, Events, customs }) {
            // clear hook done
            await hooks.done.clear();

            // hook done won't run because it was cleared uppper
            await hooks.done.flush('waterfall');
        }
    }
);
```

```bash
my plugin A options {}
my plugin B options { name: 'bbb' }
my plugin A hook run
my plugin B hook run
```

# LICENSE

MIT