/** @format */

import { checkConfigMatch } from './config/check-config-match';
import { ByndlyConfig } from './types/byndly-config.type';
import { format } from './utils/format';

const c = (a: ByndlyConfig) => JSON.stringify(a);

export const byndly = (config: ByndlyConfig) => {
    let _config: ByndlyConfig = config;
    // @todo -> create server implementation
    const server = {};

    const runInit = () => {
        // @todo -> Run the server setup, bundle watcher and other processes.
    };

    return {
        setConfig: (config: ByndlyConfig) => {
            // Return early if the config matches the previous config;
            if (checkConfigMatch(_config, config)) return;

            // Run the init method when the config has changed.
            console.log(format.info('Config changed, reloading...'));
            _config = config;
            runInit();
        },
    };
};
