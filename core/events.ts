type flushTypes = 'waterfall' | 'bail';

export class Events {
    constructor() {

    }

    eventList: Array< Function > = [];

    tap(callback: Function) {
        this.eventList.push(callback);
    }

    async flush(type: flushTypes = 'waterfall') {
        switch(type) {
            case 'waterfall':
                {
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const callback = this.eventList[i];
                        await callback();
                    }
                }
                break;

            case 'bail':
                {
                    const promises = [];
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const callback = this.eventList[i];
                        promises.push(new Promise((resolve, reject) => {
                            resolve(callback());
                        }));
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