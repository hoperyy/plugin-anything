"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.init = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// import * as gulp from 'gulp';
const events_1 = require("./events");
// generate entries
// build files inside packages
// build index.js
class Core {
    constructor(options = {}, callbackMap) {
        this.utils = {
            isArray(param) {
                return Object.prototype.toString.call(param) === '[object Array]';
            },
            isString(param) {
                return Object.prototype.toString.call(param) === '[object String]';
            },
            isFunction(param) {
                return Object.prototype.toString.call(param) === '[object Function]';
            }
        };
        this.outerContext = {
            hooks: {},
            utils: {
                Events: events_1.Events
            },
        };
        this.options = {
            searchList: [],
            plugins: [],
            presets: []
        };
        this.options = Object.assign(Object.assign({}, this.options), options);
        (() => __awaiter(this, void 0, void 0, function* () {
            yield callbackMap.registHooks(this.outerContext);
            yield this.runPlugins();
            yield callbackMap.bootstrap(this.outerContext);
        }))();
    }
    getPluginList() {
        const { plugins: pluginNames, presets: presetNames } = this.options;
        // search plugin/presets entries
        const standardPluginList = pluginNames.map(name => this.findModule(name, 'plugin')).filter(item => !!item);
        // const standardPresetList: typePluginPresetInputArray = pluginNames.map(name => this.findModule(name, 'preset')).filter(item => !!item);
        const pluginConstructors = standardPluginList.map(({ Fn, options }) => {
            return {
                Fn,
                options,
            };
        });
        return pluginConstructors;
    }
    ;
    findModule(input, tag) {
        let standardOutput = null;
        // format input
        let standardInput = null;
        const { isString, isArray, isFunction } = this.utils;
        if (isString(input)) {
            standardInput = {
                name: input,
                options: {}
            };
        }
        else if (isArray(input)) {
            standardInput = {
                name: input[0],
                options: input[1] || {}
            };
        }
        else if (isFunction(input)) {
            standardInput = {
                name: input,
                options: {}
            };
        }
        if (!standardInput) {
            return null;
        }
        // const prefix = `plugined-rollup-scaffold-${tag}-`;
        if (isFunction(standardInput.name)) {
            standardOutput = {
                Fn: standardInput.name,
                options: standardInput.options,
            };
        }
        else if (isString(standardInput.name)) {
            for (let i = 0, len = this.options.searchList.length; i < len; i++) {
                const curSearchPath = this.options.searchList[i];
                const moduleName = standardInput.name; // standardInput.name.indexOf(prefix) === -1 ? `${prefix}${standardInput.name}` : standardInput.name;
                const modulePath = path.join(curSearchPath, moduleName, 'index.js');
                if (fs.existsSync(modulePath)) {
                    standardOutput = {
                        Fn: require(modulePath).default,
                        options: standardInput.options,
                    };
                    break;
                }
            }
        }
        return standardOutput;
    }
    runPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            const plugins = this.getPluginList();
            const promises = plugins.map(({ Fn, options }) => __awaiter(this, void 0, void 0, function* () {
                const plugin = new Fn(options);
                plugin.apply && (yield plugin.apply(this.outerContext));
            }));
            yield Promise.all(promises);
        });
    }
}
function init(initOptions, callbacks) {
    return new Core(initOptions, callbacks);
}
exports.init = init;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUV6QixnQ0FBZ0M7QUFDaEMscUNBQWtDO0FBR2xDLG1CQUFtQjtBQUVuQiw4QkFBOEI7QUFFOUIsaUJBQWlCO0FBQ2pCLE1BQU0sSUFBSTtJQUNOLFlBQVksVUFBMkIsRUFBRSxFQUFFLFdBQThCO1FBVXpFLFVBQUssR0FBYztZQUNmLE9BQU8sQ0FBQyxLQUFVO2dCQUNkLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGdCQUFnQixDQUFDO1lBQ3RFLENBQUM7WUFDRCxRQUFRLENBQUMsS0FBVTtnQkFDZixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztZQUN2RSxDQUFDO1lBQ0QsVUFBVSxDQUFDLEtBQVU7Z0JBQ2pCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLG1CQUFtQixDQUFDO1lBQ3pFLENBQUM7U0FDSixDQUFBO1FBRU8saUJBQVksR0FBcUI7WUFDckMsS0FBSyxFQUFFLEVBQUU7WUFFVCxLQUFLLEVBQUU7Z0JBQ0gsTUFBTSxFQUFOLGVBQU07YUFDVDtTQUNKLENBQUE7UUFFTyxZQUFPLEdBQW9CO1lBQy9CLFVBQVUsRUFBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLEVBQUU7WUFDWCxPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUM7UUFqQ0UsSUFBSSxDQUFDLE9BQU8sbUNBQVEsSUFBSSxDQUFDLE9BQU8sR0FBSyxPQUFPLENBQUUsQ0FBQztRQUUvQyxDQUFDLEdBQVMsRUFBRTtZQUNSLE1BQU0sV0FBVyxDQUFDLFdBQVcs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