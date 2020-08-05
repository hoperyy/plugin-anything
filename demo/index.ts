
import { runPluginAnything } from '../core/index';

export const run = async (userOptions) => {
    runPluginAnything(userOptions, {
        async hooks({ hooks, Events }) {
            hooks.done = new Events();
        },
        async bootstrap({ hooks, Events }) {
            // flush hooks
            await hooks.done.flush('waterfall');
        }
    });
};