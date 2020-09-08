
export interface typeInitOptions {
    searchList?: Array<string>;
    plugins?: Array<string | Function | object | Array<any>>;
    presets?: Array<string | Array<any>>;
    hooks?: Array<string>;
    onInit?(any): any;
    onLifecycle?(any): any;
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


export interface typeContext {
    hooks: object;
    Hooks: HookConstructor,
    [ name: string ]: any,
}

export interface typeStandardPluginPresetItem {
    value: FunctionConstructor | { apply: (data?: any) => any, [name: string]: any };
    options: any;
}