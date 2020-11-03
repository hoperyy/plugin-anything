
import { PluginAnything } from '../core/index';

class MyPlugin__A {
    constructor(options) {
        // console.log('my plugin A options', options);
    }

    apply(pa) {
        const { hooks, utils, Hooks } = pa;

        hooks.done.tap('my plugin A', async (data) => {
            // console.log('my plugin A hook run', data);
            return 'a';
        });
    }
}

class MyPlugin__B {
    constructor(options) {
        // console.log('my plugin B options', options);
    }

    apply(pa) {
        const { hooks, utils, Hooks } = pa;

        hooks.done.tap('my plugin B', async (data) => {
            // console.log('my plugin B hook run', data);
        });
    }
}

class MyPlugin__C {
    constructor(options) {
        // console.log('my plugin C options', options);
    }

    name: string;

    apply(pa) {
        const { hooks, utils, Hooks } = pa;

        hooks.done.tap('my plugin C', async (data) => {
            // console.log('my plugin C hook run', data);
        });
    }
}


const pa = new PluginAnything();

// init something into pa
Object.assign(pa, {
    utils: {
        aaa: 1
    },
    hooks: {
        start: pa.createHook(),
        done: pa.createHook(),
    }
});

// install plugins
pa.installPlugins({
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
    await pa.hooks.done.flush('paralle-sync', null, 2);
})();