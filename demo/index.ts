
import { runPluginAnything } from '../core/index';

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