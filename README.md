# Inroduction

Make pluginable applications.

# Usage

```js
const { runPluginAnything } = require('plugin-anything');

runPluginAnything(
    {
        searchList: [],
        plugins: [],
    }, 
    {
        async hooks({ hooks, Events }) {
            hooks.done = new Events();
        },
        async bootstrap({ hooks, Events }) {
            // flush hooks
            await hooks.done.flush('waterfall');
        }
    }
);
```