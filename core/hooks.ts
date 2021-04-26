type flushTypes = 'sync' | 'waterfall' | 'paralle' | 'paralle-sync';

import { eventListType } from './types';

import { isPromise } from './utils';

export class Hooks {
    constructor() {}

    public eventList: eventListType = [];

    public preEventList: Array<any> = [];
    public afterEventList: Array<any> = [];

    public beforeEveryFlushCallback = (name): any => {};

    public afterEveryFlushCallback = (name): any => {};

    public clear() {
        this.eventList = [];
    }

    public async tap(name: string, callback: Function | Promise<any>): Promise<any> {
        if (typeof name !== 'string') {
            throw Error('\n\n[plugin-anything] "name" should be a string in tap(name: string, callback: Function)\n\n');
        }

        this.eventList.push({
            name,
            callback
        });
    }

    // clear eventList
    public untap(eventName?: string) {
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

    public beforeFlush(callback) {
        this.preEventList.push(callback);
    }

    public afterFlush(callback) {
        this.afterEventList.push(callback);
    }

    public beforeEveryFlush(callback) {
        this.beforeEveryFlushCallback = callback;
    }

    public afterEveryFlush(callback) {
        this.afterEveryFlushCallback = callback;
    }

    public async flushPreEvents(initData) {
        let preRt = initData;

        for (let i = 0, len = this.preEventList.length; i < len; i++) {
            preRt = await this.preEventList[i](preRt);
        }

        return preRt;
    }

    public async flushAfterEvents() {
        for (let i = 0, len = this.afterEventList.length; i < len; i++) {
            await this.afterEventList[i]();
        }
    }

    public async flush(type: flushTypes = 'sync', { paralleLimit = 3, skip = false, initData = undefined, before = (name: string, data?: any) => { }, after = (name: string, data?: any) => {} } = {}, onError = (err) => {}) {
        try {
            const finalInitData = await this.flushPreEvents(initData);

            switch (type) {
                // sync running
                case 'sync':
                    {
                        for (let i = 0; i < this.eventList.length; i++) {
                            const { callback, name } = this.eventList[i];

                            await before(name);
                            await this.beforeEveryFlushCallback(name);

                            if (!skip) {
                                if (isPromise(callback)) {
                                    await callback as Promise<any>;
                                } else {
                                    await (callback as Function)(finalInitData);
                                }
                            }

                            await after(name);
                            await this.afterEveryFlushCallback(name);
                        }
                    }
                    break;

                // sync running && next hook will receive previous hook returns.
                case 'waterfall':
                    {
                        let preRt = finalInitData;
                        for (let i = 0; i < this.eventList.length; i++) {
                            const { callback, name } = this.eventList[i];

                            let curRt = null;

                            await before(name);
                            await this.beforeEveryFlushCallback(name);

                            if (!skip) {
                                if (isPromise(callback)) {
                                    curRt = await callback as Promise<any>;
                                } else {
                                    curRt = await (callback as Function)(preRt);
                                }
                            }

                            await after(name, curRt);
                            await this.afterEveryFlushCallback(name);

                            preRt = curRt;
                        }
                    }
                    break;

                // paralle running
                case 'paralle':
                    {
                        const promises = [];
                        for (let i = 0; i < this.eventList.length; i++) {
                            const { callback, name } = this.eventList[i];
                            promises.push(new Promise<void>(async (resolve, reject) => {
                                if (isPromise(callback)) {

                                    await before(name);
                                    await this.beforeEveryFlushCallback(name);

                                    if (!skip) {
                                        await callback;
                                    }

                                    await after(name);
                                    await this.afterEveryFlushCallback(name);

                                    resolve();
                                } else {
                                    await before(name);
                                    await this.beforeEveryFlushCallback(name);

                                    if (!skip) {
                                        await (callback as Function)(finalInitData);
                                    }

                                    await after(name);
                                    await this.afterEveryFlushCallback(name);

                                    resolve();
                                }
                            }));
                        }

                        await Promise.all(promises);
                    }
                    break;

                case 'paralle-sync':
                    {
                        const promises = [];
                        for (let i = 0; i < this.eventList.length; i = i + paralleLimit) {
                            const eventPartList = this.eventList.slice(i, i + paralleLimit);
                            const subPromises = [];

                            for (let k = 0, lenK = eventPartList.length; k < lenK; k++) {
                                const { callback, name } = eventPartList[k];
                                subPromises.push(new Promise<void>(async (resolve, reject) => {
                                    if (isPromise(callback)) {
                                        await before(name);
                                        await this.beforeEveryFlushCallback(name);

                                        if (!skip) {
                                            await callback;
                                        }

                                        await after(name);
                                        await this.afterEveryFlushCallback(name);

                                        resolve();
                                    } else {
                                        await before(name);
                                        await this.beforeEveryFlushCallback(name);

                                        if (!skip) {
                                            await (callback as Function)(finalInitData);
                                        }

                                        await after(name);
                                        await this.afterEveryFlushCallback(name);

                                        resolve();
                                    }
                                }));
                            }

                            promises.push(subPromises);
                        }

                        for (let i = 0, len = promises.length; i < len; i++) {
                            await Promise.all(promises[i]);
                        }
                    }
                    break;

                default:
                    console.log(`[plugin-anything] flush type "${type}" is not supported.`);
                    break;
            }

            await this.flushAfterEvents();
        } catch(err) {
            throw new Error(err);
        }
    }
}