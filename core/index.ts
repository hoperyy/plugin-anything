const undefined = void 0;

import * as path from 'path';
import * as fs from 'fs';

import { Hooks } from './hooks';
import { toRawType, isArray, isString, isFunction, isPlainObject } from './utils';
import { typeInitOptions, typeStandardPluginPresetItem, typePluginPresetUserItem, typePluginPresetArray } from './types';

const symbolFileModoule = Symbol('findModule');
const symboleGetPluginList = Symbol('getPluginList');
const symboleOptions = Symbol('options');

export class PluginAnything {
    constructor() {};

    [ name: string ]: any;

    public clearHooks(hooks) {
        const names = Object.keys(hooks);

        for (let i = 0, len = names.length; i < len; i++) {
            hooks[names[i]].clear();
        }
    }

    public createHook() {
        return new Hooks();
    };

    public installPlugins(initOptions: typeInitOptions) {
        // merge config
        Object.assign(this[symboleOptions], {
            searchList: initOptions.searchList || [],
            plugins: initOptions.plugins || [],
            presets: initOptions.presets || [],
        });

        const plugins: typePluginPresetArray = this[symboleGetPluginList]();

        plugins.forEach(({ value, options }) => {
            let pluginObject;

            if (isFunction(value)) {
                const Fn: FunctionConstructor = value as FunctionConstructor;
                pluginObject = new Fn(options);
            } else {
                pluginObject = value;
            }

            pluginObject.apply && pluginObject.apply(this);
        });
    }

    private readonly [symboleOptions] = {
        searchList: [],
        plugins: [],
        presets: [],
    };

    private [symboleGetPluginList](): typePluginPresetArray {
        const { plugins: pluginNameList, presets: presetNameList } = this[symboleOptions];

        // search plugin/presets entries
        const standardPluginList: typePluginPresetArray = pluginNameList.map(input => this[symbolFileModoule](input, 'plugin')).filter(item => !!item);

        return standardPluginList;
    };

    private [symbolFileModoule](input: typePluginPresetUserItem, tag: 'plugin' | 'preset'): typeStandardPluginPresetItem {
        let standardOutput = null;

        const type = toRawType(input);

        // use strategy pattern optimize code
        const standardInputMap = {
            'string': {
                value: isString(input) ? input : undefined,
                options: {}
            },
            'array': {
                value: isArray(input) ? input[0] : undefined,
                options: input[1] || {}
            },
            'function': {
                value: isFunction(input) ? input : undefined,
                options: {}
            },
            'object': {
                value: isPlainObject(input) && isFunction((input as { apply: Function }).apply) ? input : undefined,
                options: {}
            }
        }

        let standardInput = standardInputMap[type] || null;

        if (!standardInput) {
            return null;
        }

        if (isFunction(standardInput.value) || isPlainObject(standardInput.value)) {
            standardOutput = {
                value: standardInput.value,
                options: standardInput.options,
            }
        } else if (isString(standardInput.value)) {
            for (let i = 0, len = this[symboleOptions].searchList.length; i < len; i++) {
                const curSearchPath: string = this[symboleOptions].searchList[i];
                const moduleName: string = standardInput.value; // standardInput.value.indexOf(prefix) === -1 ? `${prefix}${standardInput.value}` : standardInput.value;
                // get absolute path
                const packageJsonPath = path.join(curSearchPath, moduleName, 'package.json');
                const indexFilePath = path.join(curSearchPath, moduleName, 'index.js');
                let modulePath: string = '';

                if (fs.existsSync(packageJsonPath)) {
                    const packageJson = require(path.join(packageJsonPath))
                    modulePath = path.join(curSearchPath, moduleName, `${packageJson.main}`);
                } else if (fs.existsSync(indexFilePath)) {
                    modulePath = indexFilePath;
                } else {
                    continue;
                }

                if (modulePath && fs.existsSync(modulePath)) {
                    const obj = require(modulePath);
                    standardOutput = {
                        value: obj.default || obj,
                        options: standardInput.options,
                    }
                    break;
                }
            }
        }

        return standardOutput;
    }
}

