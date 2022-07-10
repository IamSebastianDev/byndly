/** @format */

/**
 * @description
 * Object used to set configuration properties to use with byndly.
 * @typedef { Object } UserConfig
 * @property { string } [bundle] - the path to the bundle / library file that will be included.
 * @property { boolean } [module] - flag indicating if the bundle is a es6 module or not.
 * @property { string[] } [include] - array of string indicating paths of
 * files to include.
 * @property { Function } [bootstrap] - function included by byndly to bootstrap the dev setup.
 * Receives the exports of the bundle as argument.
 * @property { boolean } [watch] - flag indicating if byndly should reload when changes are detected
 * in the bundle.
 * @property { number | string } [port] - port to use with byndly.
 * @property { string } [host] - host to use with byndly.
 * @property { boolean } [quiet] - flag indicating if logs should be suppressed.
 * @property { boolean } [verbose] - flag indicating if extended logs should be sent to the console. Will log
 * all HTTP requests done by byndly.
 */

const defaultConfig = {
    module: false,
    watch: true,
    port: 31415,
    host: '127.0.0.1',
    quiet: false,
    verbose: false,
    name: 'Byndly',
    bootstrap: undefined,
    include: undefined,
    bundle: undefined,
};

const ARGS_DICT = {
    w: 'watch',
    p: 'port',
    h: 'host',
    q: 'quiet',
    v: 'verbose',
    m: 'module',
    b: 'bundle',
};

/** @todo: Assert that the passed configuration via flags is correctly using long and short flags */

export const mergeConfig = (userConfig, args) => {
    const argConfig = {};
    for (const arg in args) {
        if (Object.hasOwnProperty.call(args, arg)) {
            const value = args[arg];
            const key = ARGS_DICT[arg] || arg;
            if (key in defaultConfig) argConfig[key] = value;
        }
    }

    return Object.assign(defaultConfig, argConfig, userConfig);
};
