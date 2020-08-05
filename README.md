# Inroduction

Make pluginable applications.

# Usage

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

        // run bootstrap
        async bootstrap({ hooks, Events, customs }) {
            // flush hooks
            await hooks.done.flush('waterfall');

            // do something
            // ...
            // console.log(customs.myConfig);
        }
    }
);
```

# LICENSE

MIT