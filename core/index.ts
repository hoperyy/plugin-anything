import * as path from 'path';
import * as fs from 'fs';

// import * as gulp from 'gulp';
import { Events } from './events';
import { typeInitOptions, typeUtils, typeStandardPluginPresetModuleItem, typePluginPresetUserItem, typeOuterContext, typePluginPresetInputArray, typePluginPresetOutputArray, typeInitCallbacks } from './types';

// generate entries

// build files inside packages

// build index.js
class Core {
    constructor(options: typeInitOptions = {}, callbackMap: typeInitCallbacks) {
        this.options = { ...this.options, ...options };

        (async () => {
            await callbackMap.registHooks(this.outerContext);
            await this.runPlugins();
            await callbackMap.bootstrap(this.outerContext);
        })();
    }

    utils: typeUtils = {
        isArray(param: any): boolean {
            return Object.prototype.toString.call(param) === '[object Array]';
        },
        isString(param: any): boolean {
            return Object.prototype.toString.call(param) === '[object String]';
        },
        isFunction(param: any): boolean {
            return Object.prototype.toString.call(param) === '[object Function]';
        }
    }

    private outerContext: typeOuterContext = {
        hooks: {},

        utils: {
            Events
        },
    }

    private options: typeInitOptions = {
        searchList: [],
        plugins: [],
        presets: []
    };

    private getPluginList(): typePluginPresetOutputArray {
        const { plugins: pluginNames, presets: presetNames } = this.options;

        // search plugin/presets entries
        const standardPluginList: typePluginPresetInputArray = pluginNames.map(name => this.findModule(name, 'plugin' )).filter(item => !!item);
        // const standardPresetList: typePluginPresetInputArray = pluginNames.map(name => this.findModule(name, 'preset')).filter(item => !!item);

        const pluginConstructors = standardPluginList.map(({ Fn, options }) => {
            return {
                Fn,
                options,
            };
        });

        return pluginConstructors;
    };

    private findModule(input: typePluginPresetUserItem, tag: 'plugin' | 'preset'): typeStandardPluginPresetModuleItem {
        let standardOutput = null;

        // format input
        let standardInput = null;

        const { isString, isArray, isFunction} = this.utils;

        if (isString(input)) {
            standardInput = {
                name: input as string,
                options: {}
            };
        } else if (isArray(input)) {
            standardInput = {
                name: input[0],
                options: input[1] || {}
            };
        } else if (isFunction(input)) {
            standardInput = {
                name: input as Function,
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
            }
        } else if (isString(standardInput.name)) {
            for (let i = 0, len = this.options.searchList.length; i < len; i++) {
                const curSearchPath: string = this.options.searchList[i];
                const moduleName: string = standardInput.name; // standardInput.name.indexOf(prefix) === -1 ? `${prefix}${standardInput.name}` : standardInput.name;
                const modulePath: string = path.join(curSearchPath, moduleName, 'index.js');

                if (fs.existsSync(modulePath)) {
                    standardOutput = {
                        Fn: require(modulePath).default,
                        options: standardInput.options,
                    }

                    break;
                }
            }
        }

        return standardOutput;
    }

    private async runPlugins() {
        const plugins: typePluginPresetOutputArray = this.getPluginList();

        const promises = plugins.map(async ( { Fn, options } ) => {
            const plugin = new Fn(options);
            plugin.apply && await plugin.apply(this.outerContext);
        });

        await Promise.all(promises);
    }
}

export function init (initOptions, callbacks) {
    return new Core(initOptions, callbacks);
}