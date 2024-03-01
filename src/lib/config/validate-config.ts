/** @format */

import { ByndlyConfig } from '../types/byndly-config.type';
import { EnvArgs } from '../types/env-args.type';

const defaultConfig = {
    module: false,
    watch: false,
    port: 31415,
    host: '127.0.0.1',
    quiet: false,
    verbose: false,
    name: 'Byndly',
    bootstrap: undefined,
    include: undefined,
    bundle: undefined,
    template: undefined,
};

const ARGS_DICT = {
    w: 'watch',
    p: 'port',
    h: 'host',
    q: 'quiet',
    v: 'verbose',
    m: 'module',
    b: 'bundle',
    t: 'template',
};

export const validateConfig = (
    pkg: Record<PropertyKey, unknown>,
    env: EnvArgs,
    config: Record<PropertyKey, unknown>,
): Required<ByndlyConfig> => {
    return {
        ...defaultConfig,
        module: pkg.type === 'module',
        name: pkg.name ?? 'Byndly',
        bundle: pkg.type === 'module' ? pkg.module ?? pkg.main : pkg.main,
        ...Object.fromEntries(Object.entries(env).map(([key, value]) => [ARGS_DICT[key] ?? key, value])),
        ...config,
    } satisfies Required<ByndlyConfig>;
};
