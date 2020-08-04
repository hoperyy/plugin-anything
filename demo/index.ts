
import { init } from '../core/index';

export const run = (userOptions) => {
    init(userOptions, {
        registHooks(context) {
            context.hooks.done = new context.utils.Events();
        },
        async bootstrap(context) {
            // flush hooks
            await context.hooks.done.flush();

            return context.rollupConfig;
        }
    });
};