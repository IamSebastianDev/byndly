/** @format */

import './utils/getConfig.mjs';

/**
 * @description
 * Defining the defaults for the configuration.
 * @type { import("./utils/getConfig.mjs").UserConfig }
 */

export const defaultConfig = {
    module: true,
    watch: true,
    port: 31415,
    host: '0.0.0.0',
    quiet: false,
    verbose: false,
    name: 'Byndly',
    bootstrap: undefined,
    include: undefined,
    bundle: undefined,
};
