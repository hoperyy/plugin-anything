# Inroduction

Make pluginable applications.

# Demo

```js
interface BaseCompilerType {
    readonly Hooks: FunctionConstructor;
    hooks: {
        [name: string]: {
            tap: Function;
            untap: Function;
            flush: Function;
        }
    };
    // ... for customs
    [ name: string ]: any
}

interface FinalCompilerType extends BaseCompilerType {
    utils: {
        [ name: string ]: any
    }
}

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply(finalCompiler: FinalCompilerType) {
        const { hooks, utils, Hooks } = finalCompiler;

        hooks.start.tap('my plugin A', async (data) => {
            console.log('my plugin A hook run');
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply(finalCompiler: FinalCompilerType) {
        const { hooks, utils, Hooks } = finalCompiler;

        hooks.done.tap('my plugin B', async (data) => {
            console.log('my plugin B hook run');
        });
    }
}

runPluginAnything(
    {

        // Array< string | FunctionContructor | Array<string | FunctionContructor, object> >
        plugins: [
            MyPlugin__A,

            [MyPlugin__B, { name: 'bbb' }]
        ],

        // Array< string >
        // search plugins when plugin name is string
        // Array item should be absolute folder path
        searchList: [],

        // init hooks and customs
        async onInit(baseCompiler: BaseCompilerType) {
            const { hooks, Hooks } = baseCompiler;

            Object.assign(hooks, {
                start: new Hooks(),
                done: new Hooks()
            });

            // add utils in compiler for lifecycle and plugins using
            Object.assign(baseCompiler, {
                utils: {
                    aaa: 1
                }
            });
        },

        // init lifecycle
        async onLifecycle(finalCompiler: FinalCompilerType) {
            // compiler.utils was added in `onInit` callback.
            const { hooks, utils, Hooks } = finalCompiler;

            await hooks.start.flush();

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

## APIs

+   `searchList`: Array< string >

    Absolute folder path list that will be used in searching plugins.

+   `plugins: Array< string | FunctionContructor | Array<string | FunctionContructor, object> >`

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

            MyPlugin,

            [ MyPlugin, { params: 2 } ]
        }
    }
    ```

+   `Hooks`

    ```ts
    const hookA = new Hooks();
    ```

    +   `.tap(name: string, callback: Function)`

        Add callback at current hook event.

        ```ts
        hookA.tap(name: string, callback: Function);
        ```

    +   `.untap(name?: string)`

        Remove callback list whose name equals `name`.

        When `name` is blank, clear callback list.

    +   `.flush(type?: sync | waterfall | paralle)`

        Run all callbacks.

# LICENSE

MIT