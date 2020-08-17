# Inroduction

Make pluginable applications.

# Demo

```js
const { PluginAnything } = require('plugin-anything');

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply(pluginAnythingContext) {
        const { hooks, utils, Hooks } = pluginAnythingContext;

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

    apply(pluginAnythingContext) {
        const { hooks, utils, Hooks } = pluginAnythingContext;

        hooks.done.tap('my plugin B', async (data) => {
            console.log('my plugin B hook run', data);
        });
    }
}

class MyPlugin__C {
    constructor(options) {
        console.log('my plugin C options', options);
    }

    apply(pluginAnythingContext) {
        const { hooks, utils, Hooks } = pluginAnythingContext;

        hooks.done.tap('my plugin C', async (data) => {
            console.log('my plugin C hook run', data);
        });
    }
}


const pluginAnythingContext = new PluginAnything();

// init something into pluginAnythingContext
Object.assign(pluginAnythingContext, {
    utils: {
        aaa: 1
    },
    hooks: {
        start: new pluginAnythingContext.Hooks(),
        done: new pluginAnythingContext.Hooks(),
    }
});

// install plugins
pluginAnythingContext.installPlugins({
    // Array< string | FunctionContructor | Array<string | FunctionContructor, object> >
    plugins: [
        MyPlugin__A,
        [ MyPlugin__B, { name: 'bbb' } ],
        new MyPlugin__C({ name: 'ccc' }),
    ],

    // search plugins when plugin name is string
    // Array< string >; Array item should be absolute folder path
    searchList: [],
});

(async () => {
    await pluginAnythingContext.hooks.done.flush('waterfall');
})();
```

```bash
my plugin C options { name: 'ccc' }
my plugin A options {}
my plugin B options { name: 'bbb' }
my plugin A hook run undefined
my plugin C hook run a
my plugin B hook run undefined
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