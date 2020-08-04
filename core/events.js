"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
class Events {
    constructor() {
        this.eventList = [];
    }
    tap(name, callback) {
        this.eventList.push({
            name,
            callback
        });
    }
    flush(type = 'waterfall') {
        return __awaiter(this, void 0, void 0, function* () {
            switch (type) {
                case 'waterfall':
                    {
                        for (let i = 0, len = this.eventList.length; i < len; i++) {
                            const { callback, name } = this.eventList[i];
                            yield callback(name);
                        }
                    }
                    break;
                default:
                    console.log(`[plugin-anything] flush type "${type}" is not supported.`);
                    break;
            }
        });
    }
}
exports.Events = Events;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE1BQWEsTUFBTTtJQUNmO1FBSUEsY0FBUyxHQUFrRCxFQUFFLENBQUM7SUFGOUQsQ0FBQztJQUlELEdBQUcsQ0FBQyxJQUFZLEVBQUUsUUFBa0I7UUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDaEIsSUFBSTtZQUNKLFFBQVE7U0FDWCxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUssS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXOztZQUMxQixRQUFPLElBQUksRUFBRTtnQkFDVCxLQUFLLFdBQVc7b0JBQ1o7d0JBQ0ksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3ZELE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDN0MsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7eUJBQ3hCO3FCQUNKO29CQUNELE1BQU07Z0JBRVY7b0JBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsSUFBSSxxQkFBcUIsQ0FBQyxDQUFDO29CQUN4RSxNQUFNO2FBQ2I7UUFDTCxDQUFDO0tBQUE7Q0FDSjtBQTlCRCx3QkE4QkMifQ==