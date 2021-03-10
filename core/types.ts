
export interface typeInitOptions {
    searchList?: Array<string>;
    plugins?: Array<string | Function | object | Array<any>>;
    presets?: Array<string | Array<any>>;
    hooks?: Array<string>;
    onInit?(any): any;
    onLifecycle?(any): any;
    onError?(any): any;
}

export interface HookConstructor {
    new (any?);
}

export interface typeUserConfig {
    plugins?: Array<string | Array<any>>,
    presets?: Array<string | Array<any>>
}

export interface typeUtils {
    isArray(param: any): boolean;
    isString(param: any): boolean;
    isFunction(param: any): boolean;
}

export type typePluginPresetArray = Array<typeStandardPluginPresetItem>;

export type typePluginPresetUserItem = string | Array<any> | Function;

export interface typeContext {
    hooks: object;
    Hooks: HookConstructor,
    [ name: string ]: any,
}

export interface typeStandardPluginPresetItem {
    value: FunctionConstructor | { apply: (data?: any) => any, [name: string]: any };
    options: any;
}

export type eventListType = Array<{ name: string, callback: Function | Promise<any> }>;