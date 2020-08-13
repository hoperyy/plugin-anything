# Inroduction

Make pluginable applications.

# Demo

```js
const { runPluginAnything } = require('plugin-anything');

interface BaseContextType {
    readonly Hooks: FunctionConstructor;
    hooks: {
        [name: string]: {
            tap: Function;
            untap: Function;
            flush: Function;
        }
    };
    // ... for customs
    [name: string]: any
}

interface FinalContextType extends BaseContextType {
    utils: {
        [name: string]: any
    }
}

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply(finalContext: FinalContextType) {
        const { hooks, utils, Hooks } = finalContext;

        hooks.done.tap('my plugin A', async (data) => {
            console.log('my plugin A hook run', data);

            return 'a';
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply(finalContext: FinalContextType) {
        const { hooks, utils, Hooks } = finalContext;

        hooks.done.tap('my plugin B', async (data) => {
            console.log('my plugin B hook run', data);
        });
    }
}

class MyPlugin__C {
    constructor(options) {
        console.log('my plugin C options', options);
    }

    name: string

    apply(finalContext: FinalContextType) {
        const { hooks, utils, Hooks } = finalContext;

        hooks.done.tap('my plugin C', async (data) => {
            console.log('my plugin C hook run', data);
        });
    }
}

runPluginAnything(
    {

        // Array< string | FunctionContructor | Array<string | FunctionContructor, object> >
        plugins: [
            MyPlugin__A,

            [MyPlugin__B, { name: 'bbb' }],

            new MyPlugin__C({ name: 'ccc' })
        ],

        // Array< string >
        // search plugins when plugin name is string
        // Array item should be absolute folder path
        searchList: [],

        async onInit(baseContext: BaseContextType) {
            const { hooks, Hooks } = baseContext;

            // init hooks
            Object.assign(hooks, {
                start: new Hooks(),
                done: new Hooks()
            });

            // add utils in compiler for lifecycle and plugins using
            Object.assign(baseContext, {
                utils: {
                    aaa: 1
                }
            });
        },

        // init lifecycle
        async onLifecycle(finalContext: FinalContextType) {
            // compiler.utils was added in `onInit` callback.
            const { hooks, utils, Hooks } = finalContext;

            // await hooks.start.flush();

            // hook done won't run if it was untapped
            await hooks.done.flush('waterfall');
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

## APIs

+   `searchList`: Array< string >

    Absolute folder path list that will be used in searching plugins.

+   `plugins: Array< string | FunctionContructor | { apply(data?: any): any; [ name: string ]: any } | Array<string | FunctionContructor, object> >`

    ```ts
    class MyPlugin {
        constructor(options) {
            this.options = options;
        };

        options: {};

        apply(compiler) {

        }
    }


    // config demo
    {
        plugins: {
            'my-plugin-0',

            [ 'my-plugin-1', { params: 1 } ],

            [ MyPlugin, { params: 2 } ],

            new MyPlugin({ params: 2 })
        }
    }
    ```

+   `Hooks`

    ```ts
    const hookA = new Hooks();
    ```

    +   `.tap(name: string, callback: Function | Promise<any>)`

        Add callback at current hook event.

        ```ts
        hookA.tap(name: string, callback: Function | Promise<any>);
        ```

    +   `.untap(name?: string)`

        Remove callback list whose name equals `name`.

        When `name` is blank, clear callback list.

    +   `.flush(type?: sync | waterfall | paralle)`

        Run all callbacks.

# LICENSE

MIT