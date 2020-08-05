
import { runPluginAnything } from '../core/index';

export const run = async (userOptions) => {
    runPluginAnything(userOptions, {
        async init({ hooks, Events, customs }) {
            hooks.done = new Events();
        },
        async lifecycle({ hooks, Events, customs }) {
            // flush hooks
            await hooks.done.flush('waterfall');
        }
    });
};