export interface typeInitOptions {
    rootPath?: string;
    searchList?: Array<string>;
    plugins?: Array<string | Array<any>>;
    presets?: Array<string | Array<any>>;
}

export interface typeInitCallbacks {
    hooks(any): any;
    bootstrap(any): any;
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

export type typePluginPresetInputArray = Array<typeStandardPluginPresetInputItem>;

export type typePluginPresetOutputArray = Array<typeStandardPluginPresetModuleItem>;

export type typePluginPresetUserItem = string | Array<any> | Function;

export interface typeRollupConfig {
    input?: any;
    external?: any;
    plugins?: Array<any>;
    onwarn?: any;
    cache?: any;
    acorn?: any;
    context?: any;
    moduleContext?: any;
    legacy?: any;

    // core
    file?: any,   // 若有 bundle.write，必填
    format?: any, // 必填
    name?: any,
    globals?: any,

    // 高级参数
    paths?: any,
    banner?: any,
    footer?: any,
    intro?: any,
    outro?: any,
    sourcemap?: any,
    sourcemapFile?: any,
    interop?: any,

    // 危险区域
    exports?: any,
    amd?: any,
    indent?: any
    strict?: any
}

export interface typeOuterContext {
    hooks: object;
    Events: Function
}

export interface typeStandardPluginPresetInputItem {
    name: string | Function;
    options: object;
}

export interface typeStandardPluginPresetModuleItem {
    Fn(options: object): void;
    options: object;
}