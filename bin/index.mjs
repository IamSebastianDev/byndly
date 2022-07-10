#!/usr/bin/env node

/** @format */

import { getEnvArgs } from '../lib/utils/getEnvArgs.mjs';
import { getConfig } from '../lib/config/getConfig.mjs';
import { mergeConfig } from '../lib/config/mergeConfig.mjs';
import { server } from '../lib/http/server.mjs';
import { fileWatcher } from '../lib/utils/fileWatcher.mjs';
import { assertElement } from '../lib/utils/assertElement.mjs';

/**
 * This is the main executable function for byndly. The method will get or create a
 * complete config object, start a server to serve the files and create a file watcher
 * to enable reloading the frontend when the file indicating the bundle changes.
 */

(async (args) => {
    // merge all available config forms and create the config object
    const config = mergeConfig(await getConfig(args.config || args.c), args);

    // check if a bundle path was supplied and if the file exists
    if (!config.bundle || !assertElement(config.bundle)) {
        console.error(
            `\x1b[31m❗ @Byndly: No bundle to serve. Define one in your config file or pass it via the --b or --bundle flag. Make sure the path is correct.\x1b[0m`
        );
        process.exit(1);
    }

    // create the minimal server that serves the bundle, includes and the reload event
    try {
        const srv = server(config);
        srv.serve();

        // initialize the fileWatcher if enabled, to reload the server when the bundle changes.
        config.watch && fileWatcher(config.bundle, srv.reload);

        !config.quiet &&
            console.log(`\x1b[32m@Byndly: 🚀 Bundle now available at 'http://${config.host}:${config.port}'...\x1b[0m`);
    } catch (e) {
        throw new Error(`@Byndly: ${e}`);
    }
})(getEnvArgs());
