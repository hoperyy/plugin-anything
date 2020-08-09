type flushTypes = 'waterfall' | 'bail';

type eventListType = Array< { name: string, callback: Function } >;

export class Events {
    constructor() {

    }

    eventList: eventListType = [];

    tap(name: string, callback: Function): any {
        this.eventList.push({
            name,
            callback
        });
    }

    // clear eventList
    clear(eventName?: string) {
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

    async flush(type: flushTypes = 'waterfall') {
        switch (type) {
            case 'waterfall':
                {
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const { name, callback } = this.eventList[i];
                        await callback(name);
                    }
                }
                break;

            case 'bail':
                {
                    const promises = [];
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const { name, callback } = this.eventList[i];
                        promises.push(new Promise((resolve, reject) => {
                            resolve(callback(name));
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