# Inroduction

Make pluginable applications.

# How does it work ?

<img style="width: 100%" src="./imgs/intro.png">

# Demo

```js
// Custom Plugins
class CustomPluginA {
    constructor(options) {
        console.log('CustomPluginA options', options);
    }

    apply(customApp) {
        customApp.hooks.hookA.tap('my plugin A', async (data) => {
            console.log('CustomPluginA runs', data);
            return 'a';
        });
    }
}

class CustomPluginB {
    constructor(options) {
        console.log('CustomPluginB options', options);
    }

    apply(customApp) {
        customApp.hooks.hookB.tap('my plugin B', async (data) => {
            console.log('CustomPluginB runs', data);
        });
    }
}

// Custom App
const { PluginAnything } = require('plugin-anything');
class CustomApp extends PluginAnything {
    constructor() {
        super();

        // define hooks for plugin using
        this.hooks = {
            hookA: this.createHook(), // 'createHook' inherits from PluginAnything
            hookB: this.createHook(), // 'createHook' inherits from PluginAnything
        }

        this.install({
            plugins: [ CustomPluginA, CustomPluginB ],
        })

        (async () => {
            // mock wait 2s
            await new Promise(resolve => setTimeout(resolve, 2000))
            await this.hooks.hookA.flush();

            // mock wait 2s
            await new Promise(resolve => setTimeout(resolve, 2000))
            await this.hooks.hookB.flush();
        })()
    }

    hooks = null;
}

new CustomApp();
```

```bash
CustomPluginA options {}
CustomPluginB options {}

# wait 2s
CustomPluginA runs
# wait 2s
CustomPluginB runs
```

## APIs

```js
const pluginAnything = new PluginAnything(options: { [name: string]: any });
```

### Hook Handler: `pluginAnything.createHook()`

```ts
const hook = createHook();
```

create a hook.

+   `hook.tap(name: string, callback: Function | Promise<any>)`

    Add callback at current hook event.

    `name` could be any string for event description.

+   `hook.untap(name?: string)`

    Remove callback list whose name equals `name`.

    When `name` is blank, clear callback list.

+   `hook.flush(type?: sync | waterfall | paralle, initData?: skip = false, paralleLimit = 3)`

    Run all callbacks.

    +   `sync` (default)

        run callbacks one next one.

    +   `waterfall`

        run callbacks one next none.

        and previous returned value will be parameter of next callback.

    +   `paralle`

        run all callbacks at the same time.

    +   `paralle-sync`

        run callbacks by sync sequences:

        ```sh
        [ callback1, callback2, cakkback3 ]

        [ callback4, ... ]

        ...
        ```

+   `hook.beforeFlush(callback)` and `hook.afterFlush(callback)`

    regist callback **before** and **after** `flush`.

    callback should be a `Function` with return type `any | Promise<any>`.

    example:

    ```js
    (async () => {
        hook.beforeFlush(async () => {
            console.log('before flush');
        });

        hook.afterFlush(async () => {
            console.log('after flush');
        });

        await hook.flush();
    })();

    // result
    log: before flush

    flushing...

    log: after flush
    ```

### Plugins Handler: `pluginAnything.install(initOptions: typeInitOptions): Array<{ [name: string]: any }>`

```typescript
interface typeInitOptions {
    searchList?: Array<string>;
    plugins?: Array<string | Function | object | Array<any>>;
    presets?: Array<string | Array<any>>;
}
```

Install plugins and return plugin list.

+   `initOptions.searchList`: Array< string >

    Absolute folder path list that will be used in searching plugins.

    examples:

    ```js
    [
        '/path_a/node_modules',
        '/path_b/node_modules'
    ]
    ```

+   `initOptions.plugins: Array< string | FunctionContructor | { apply(data?: any): any; [ name: string ]: any } | Array<string | FunctionContructor, object> >`

    ```ts
    class MyPlugin {
        constructor(options) {
            this.options = options;
        };

        options: {};

        apply(pa) {

        }
    }


    // config demo
    plugins: {
        'my-plugin-0',

        [ 'my-plugin-1', { params: 1 } ],

        [ MyPlugin, { params: 2 } ],

        new MyPlugin({ params: 2 })
    }
    ```

# LICENSE

MIT