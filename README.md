# Inroduction

Make pluginable applications.

# APIs

```js
const { runPluginAnything } = require('plugin-anything');

runPluginAnything(
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
            Object.assign(hooks, {
                start: new Events(),
                done: new Events(),
            });

            // init customs params
            Object.assign(customs, {
                test: 1
            });
        },

        // init lifecycle
        async onLifecycle({ hooks, Events, customs }) {
            // flush hooks
            await hooks.start.flush();

            // do something
            // ...
            // console.log(customs.myConfig);

            await hooks.done.flush();
        }
    }
);
```

+   `searchList`: Array< string >

    Absolute folder path list that will be used in searching plugins.

+   `plugins: Array< string | FunctionContructor | Array<string | FunctionContructor, object> >`

    ```ts
    class MyPlugin {
        constructor(options) {
            this.options = options;
        };

        options: {};

        apply({ hooks, Events, customs }) {

        }
    }


    // config demo
    {
        plugins: {
            'my-plugin-0',

            [ 'my-plugin-1', { params: 1 } ],

            MyPlugin,

            [ MyPlugin, { params: 2 } ]
        }
    }
    ```

+   `Events`

    ```ts
    const hookA = new Events();
    ```

    +   `.tap(name: string, callback: Function)`

        Add callback at current hook event.

        ```ts
        hookA.tap(name: string, callback: Function);
        ```

    +   `.untap(name?: string)`

        Remove callback list whose name equals `name`.

        When `name` is blank, clear callback list.

    +   `.flush(type?: waterfall | bail)`

        Run all callbacks.

# Demo

```js
const { runPluginAnything } = require('plugin-anything');

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply({ hooks, Events, customs }) {
        hooks.start.tap('my plugin A', async () => {
            console.log('my plugin A hook run');
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply({ hooks, Events, customs }) {
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

        // init hooks and customs
        async onInit({ hooks, Events, customs }) {
            Object.assign(hooks, {
                start: new Events(),
                done: new Events(),
            });

            // init customs params
            Object.assign(customs, {
                test: 1
            });
        },

        // init lifecycle
        async onLifecycle({ hooks, Events, customs }) {
            await hooks.start.flush();

            // untap: hook done
            // await hooks.done.untap();

            // hook done won't run if it was untapped
            await hooks.done.flush();
        }
    }
);
```

```bash
my plugin A options {}
my plugin B options { name: 'bbb' }
my plugin B hook run
my plugin A hook run
```

# LICENSE

MIT