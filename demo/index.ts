
import { runPluginAnything } from '../core/index';

class MyPlugin__A {
    constructor(options) {
        console.log('my plugin A options', options);
    }

    apply({ hooks, Events, customs }) {
        hooks.done.tap('my plugin A', async () => {
            console.log('my plugin A hook run');
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply({ hooks, Events, customs }) {
        hooks.start.tap('my plugin B', async () => {
            console.log('my plugin B hook run');
        });
    }
}

runPluginAnything(
    {
        plugins: [
            MyPlugin__A,

            [MyPlugin__B, { name: 'bbb' }]
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