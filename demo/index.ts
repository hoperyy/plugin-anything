
import { runPluginAnything } from '../core/index';

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

    apply(compiler: FinalCompilerType) {
        const { hooks, utils, Hooks } = compiler;

        hooks.start.tap('my plugin A', async () => {
            console.log('my plugin A hook run');
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        console.log('my plugin B options', options);
    }

    apply(compiler: FinalCompilerType) {
        const { hooks, utils, Hooks } = compiler;

        hooks.done.tap('my plugin B', async () => {
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
        async onInit(compiler: BaseCompilerType) {
            const { hooks, Hooks } = compiler;

            Object.assign(hooks, {
                start: new Hooks(),
                done: new Hooks()
            });

            // add utils in compiler for lifecycle and plugins using
            Object.assign(compiler, {
                utils: {
                    aaa: 1
                }
            });
        },

        // init lifecycle
        async onLifecycle(compiler: FinalCompilerType) {
            // compiler.utils was added in `onInit` callback.
            const { hooks, utils, Hooks } = compiler;

            await hooks.start.flush();

            // hook done won't run if it was untapped
            await hooks.done.flush();
        }
    }
);