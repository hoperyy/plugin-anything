import * as path from 'path';
import * as fs from 'fs';

import { Events } from './events';
import { toRawType, isArray, isString, isFunction } from './utils';
import { typeInitOptions, typeStandardPluginPresetItem, typePluginPresetUserItem, typeOuterContext, typePluginPresetArray } from './types';

const undefined = void 0;

export class PluginAnything {
    constructor(initOptions: typeInitOptions) {
        Object.assign(this.options, {
            searchList: initOptions.searchList || [],
            plugins: initOptions.plugins || [],
            presets: initOptions.presets || [],
        });

        (async () => {
            initOptions.onInit && (await initOptions.onInit(this.outerContext));
            await this.flushPlugins();
            initOptions.onLifecycle && (await initOptions.onLifecycle(this.outerContext));
        })();
    }

    private outerContext: typeOuterContext = {
        hooks: {},
        Events,
        customs: {},
    }

    private readonly options = {
        searchList: [],
        plugins: [],
        presets: [],
    };

    private getPluginList(): typePluginPresetArray {
        const { plugins: pluginNameList, presets: presetNameList } = this.options;

        // search plugin/presets entries
        const standardPluginList: typePluginPresetArray = pluginNameList.map(name => this.findModule(name, 'plugin')).filter(item => !!item);

        const pluginConstructors = standardPluginList.map(({ Fn, options }) => {
            return {
                Fn,
                options,
            };
        });

        return pluginConstructors;
    };

    private findModule(input: typePluginPresetUserItem, tag: 'plugin' | 'preset'): typeStandardPluginPresetItem {
        let standardOutput = null;

        const type = toRawType(input)

        // use strategy pattern optimize code
        const standardInputMap = {
            'string': {
                name: isString(input) ? input : undefined,
                options: {}
            },
            'array': {
                name: isArray(input) ? input[0] : undefined,
                options: input[1] || {}
            },
            'function': {
                name: isFunction(input) ? input : undefined,
                options: {}
            }
        }

        let standardInput = standardInputMap[type] || null;

        if (!standardInput) {
            return null;
        }

        if (isFunction(standardInput.name)) {
            standardOutput = {
                Fn: standardInput.name,
                options: standardInput.options,
            }
        } else if (isString(standardInput.name)) {
            for (let i = 0, len = this.options.searchList.length; i < len; i++) {
                const curSearchPath: string = this.options.searchList[i];
                const moduleName: string = standardInput.name; // standardInput.name.indexOf(prefix) === -1 ? `${prefix}${standardInput.name}` : standardInput.name;
                // get absolute path
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

    private async flushPlugins() {
        const plugins: typePluginPresetArray = this.getPluginList();

        const promises = plugins.map(async ({ Fn, options }) => {
            const plugin = new Fn(options);
            plugin.apply && await plugin.apply(this.outerContext);
        });

        await Promise.all(promises);
    }
}

export function runPluginAnything(initOptions) {
    return new PluginAnything(initOptions);
}
