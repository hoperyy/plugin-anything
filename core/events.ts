import { waterfallRun, parallelRun } from './utils'

type flushTypes = 'waterfall' | 'bail';
interface EventListType {
    [name: string]: Function;
}

export class Events {
    constructor() {

    }

    eventList: EventListType

    subscribe(name: string, callback: Function) {
        this.eventList[name] = callback
    }

    unSubscribe(name?: string) {
        // if no params, clear eventList
        if (!name) {
            return this.eventList = {}
        }
        // unsubscribe one callback
        // this.eventList[name] = () => {}
        delete this.eventList[name]
    }

    // 执行单个发布操作
    async publish(name?: string) {
        const callback = this.eventList[name]
        await callback()
    }

    // 发布所有事件
    // 个人认为之后可以替代 flush 了
    // isParallel 为 true 时，并行执行；默认串型执行
    async publishAll(isParallel = false) {
        return isParallel ? await parallelRun(this.eventList) : await waterfallRun(this.eventList)
    }

    async flush(type: flushTypes = 'waterfall') {
        switch (type) {
            case 'waterfall':
                {
                    // for (let i = 0, len = this.eventList.length; i < len; i++) {
                    //     const callback = this.eventList[i];
                    //     await callback();
                    // }
                    for (const name in this.eventList) {
                        const callback = this.eventList[name];
                        await callback();
                    }
                }
                break;

            case 'bail':
                {
                    const promises = [];
                    // for (let i = 0, len = this.eventList.length; i < len; i++) {
                    //     const callback = this.eventList[i];
                    //     promises.push(new Promise((resolve, reject) => {
                    //         resolve(callback());
                    //     }));
                    // }
                    for (const name in this.eventList) {
                        // get callback
                        const callback = this.eventList[name];

                        promises.push(new Promise(resolve => {
                            resolve(callback());
                        }))
                    }

                    await Promise.all(promises);
                }
                break;

            default:
                console.log(`[plugin-anything] flush type "${type}" is not supported.`);
                break;
        }
    }
}