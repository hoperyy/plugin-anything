# Inroduction

Make pluginable applications.

# Usage

```js
const { init } = require('plugin-anything');

init(
    {
        searchList: [],
        plugins: [],
    }, 
    {
        registHooks(context) {
            context.hooks.done = new context.utils.Events();
        },
        async bootstrap(context) {
            // flush hooks
            await context.hooks.done.flush();

            console.log('do something');
        }
    }
);
```