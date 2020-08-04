export class Events {
    constructor() {

    }

    eventList: Array< { name: string; callback: Function } > = [];

    tap(name: string, callback: Function) {
        this.eventList.push({
            name,
            callback
        });
    }

    async flush(type = 'waterfall') {
        switch(type) {
            case 'waterfall':
                {
                    for (let i = 0, len = this.eventList.length; i < len; i++) {
                        const { callback, name } = this.eventList[i];
                        await callback(name);
                    }
                }
                break;

            default:
                console.log(`[plugin-anything] flush type "${type}" is not supported.`);
                break;
        }
    }
}