# Inroduction

Make pluginable applications.

# APIs

```js
const { runPluginAnything } = require('plugin-anything');

runPluginAnything(
    {
        
    }, 
    {
        /** options **/

        // Array< string >
        // search plugins when plugin name is string
        // Array item should be absolute folder path
        searchList: [
            // string: absolute folder path
        ],

        // Array< string | FunctionContructor | Array<string | FunctionContructor, object> >
        plugins: [
            // string: plugin name
            // FunctionContructor: Plugin Constructor
            // Array: [ string | FunctionContructor, options object ]
        ],


        /** callbacks **/

        // init something like: hooks, customs config
        async onInit({ hooks, Events, customs }) {
            hooks.done = new Events();
            customs.myConfig = {};
        },

        // run lifecycle
        async onLifecycle({ hooks, Events, customs }) {
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
        ],
        async onInit({ hooks, Events, customs }) {
            hooks.done = new Events();
        },
        async onLifecycle({ hooks, Events, customs }) {
            // clear hook done
            // await hooks.done.clear();

            // hook done won't run if it was cleared uppper
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