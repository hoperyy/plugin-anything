
import { PluginAnything } from '../core/index';

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

    name: string;

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