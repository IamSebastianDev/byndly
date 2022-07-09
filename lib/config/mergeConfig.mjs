/** @format */

import { defaultConfig } from './default.config.mjs';

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
