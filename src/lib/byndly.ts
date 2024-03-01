/** @format */

import { server } from '../../.idea/http/server.mjs';
import { checkConfigMatch } from './config/check-config-match';
import { httpServer } from './http/server';
import { ByndlyConfig } from './types/byndly-config.type';
import { createFileWatcher } from './utils/create-file-watcher';
import { format } from './utils/format';
import { onShutdown } from './utils/on-shutdown';

export const byndly = (config: Required<ByndlyConfig>) => {
    let _config: Required<ByndlyConfig> = config;
    if (!_config.bundle) {
        throw new Error(
            `No bundle to serve. Define one in your config file or pass it via the --b or --bundle flag. Ensure the path is correct.`,
        );
    }

    const server = httpServer();
    let bundleWatcher = createFileWatcher(_config.bundle);
    const unsubscribe = bundleWatcher.subscribe(async () => {
        server.reload();
    });

    onShutdown(async () => {
        bundleWatcher.close();
        unsubscribe();
    });

    const runInit = () => {
        if (!_config.bundle) {
            throw new Error(
                `No bundle to serve. Define one in your config file or pass it via the --b or --bundle flag. Ensure the path is correct.`,
            );
        }

        if (bundleWatcher) {
            bundleWatcher.close();
            bundleWatcher = createFileWatcher(_config.bundle);
        }

        server.close();
        server.listen(_config);
    };

    runInit();

    return {
        setConfig: (config: Required<ByndlyConfig>) => {
            // Return early if the config matches the previous config;
            if (checkConfigMatch(_config, config)) return;

            // Run the init method when the config has changed.
            console.clear();
            console.log(format.info(`[${new Date().toLocaleTimeString()}] Config change detected, restarting! 🚀`));
            _config = config;
            runInit();
        },
    };
};
