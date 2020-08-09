
import { runPluginAnything } from '../core/index';

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply({ hooks, customs }) {
        hooks.done.tap('my plugin A', async () => {
            console.log('my plugin A');
        });
    }
}


class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply({ hooks, customs }) {
        hooks.done.tap('my plugin B', async () => {
            console.log('my plugin B');
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
            // flush hooks
            await hooks.done.flush('waterfall');
        }
    }
);