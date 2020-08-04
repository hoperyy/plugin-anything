
import { run } from '../core/index';

export const runPluginAnything = async (userOptions) => {

    run(userOptions, {
        async hooks({ hooks, Events }) {
            hooks.done = new Events();
        },
        async bootstrap({ hooks, Events }) {
            // flush hooks
            await hooks.done.flush('waterfall');
        }
    });
};