type flushTypes = 'sync' | 'waterfall' | 'paralle';

type eventListType = Array< { name: string, callback: Function } >;

export class Hooks {
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

    async flush(type: flushTypes = 'sync') {
        switch (type) {
            // sync running
            case 'sync':
                {
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const { callback } = this.eventList[i];
                        await callback(null);
                    }
                }
                break;

            // sync running && next hook will receive previous hook returns.
            case 'waterfall':
                {
                    let preRt = null;
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const { callback } = this.eventList[i];
                        const curRt = await callback(preRt);
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
                            resolve(callback(null));
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