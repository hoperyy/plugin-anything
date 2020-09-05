type flushTypes = 'sync' | 'waterfall' | 'paralle';

type eventListType = Array<{ name: string, callback: Function | Promise<any> } >;

import { isPromise } from './utils';

export class Hooks {
    constructor() {

    }

    eventList: eventListType = [];

    preEventList: Array<any> = [];
    afterEventList: Array<any> = [];

    async tap(name: string, callback: Function | Promise<any>): Promise<any> {
        if (typeof name !== 'string') {
            throw Error('\n\n[plugin-anything] "name" should be a string in tap(name: string, callback: Function)\n\n');
        }

        this.eventList.push({
            name,
            callback
        });
    }

    // clear eventList
    untap(eventName?: string) {
        if (!eventName) {
            this.eventList = [];
        } else {
            const oldEventList = this.eventList;
            const newEventList = [];

            for (let i = 0, len = oldEventList.length; i < len; i++) {
                const item = oldEventList[i];

                if (item.name !== eventName) {
                    newEventList.push(item);
                }
            }

            this.eventList = newEventList;
        }
    }

    beforeFlush(callback) {
        this.preEventList.push(callback);
    }

    afterFlush(callback) {
        this.afterEventList.push(callback);
    }

    async flushPreEvents() {
        for (let i = 0, len = this.preEventList.length; i < len; i++) {
            await this.preEventList[i]();
        }
    }

    async flushAfterEvents() {
        for (let i = 0, len = this.afterEventList.length; i < len; i++) {
            await this.afterEventList[i]();
        }
    }

    async flush(type: flushTypes = 'sync', initData?: any) {
        try {
            await this.flushPreEvents();

            switch (type) {
                // sync running
                case 'sync':
                    {
                        for (let i = 0, len = this.eventList.length; i < len; i++) {
                            const { callback } = this.eventList[i];

                            if (isPromise(callback)) {
                                await callback as Promise<any>;
                            } else {
                                await (callback as Function)(initData);
                            }
                        }
                    }
                    break;

                // sync running && next hook will receive previous hook returns.
                case 'waterfall':
                    {
                        let preRt = initData;
                        for (let i = 0, len = this.eventList.length; i < len; i++) {
                            const { callback } = this.eventList[i];

                            let curRt = null;

                            if (isPromise(callback)) {
                                curRt = await callback as Promise<any>;
                            } else {
                                curRt = await (callback as Function)(preRt);
                            }

                            preRt = curRt;
                        }
                    }
                    break;

                // paralle running
                case 'paralle':
                    {
                        const promises = [];
                        for (let i = 0, len = this.eventList.length; i < len; i++) {
                            const { callback } = this.eventList[i];
                            promises.push(new Promise((resolve, reject) => {
                                if (isPromise(callback)) {
                                    resolve(callback);
                                } else {
                                    resolve((callback as Function)(initData));
                                }
                            }));
                        }

                        await Promise.all(promises);
                    }
                    break;

                default:
                    console.log(`[plugin-anything] flush type "${type}" is not supported.`);
                    break;
            }

            await this.flushAfterEvents();
        } catch(err) {
            console.log(`[plugin-anything] flush error: `, err);
        }
    }
}