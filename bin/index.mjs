#!/usr/bin/env node

/** @format */

import { getEnvArgs } from '../lib/utils/getEnvArgs.mjs';
import { getConfig } from '../lib/config/getConfig.mjs';
import { mergeConfig } from '../lib/config/mergeConfig.mjs';
import { server } from '../lib/http/server.mjs';
import { fileWatcher } from '../lib/utils/fileWatcher.mjs';

(async (args) => {
    // merge all available config forms and create the config object
    const config = mergeConfig(await getConfig(args.config || args.c), args);

    // create the minimal server that serves the bundle, includes and the reload event
    const srv = server(config);
    srv.serve();

    // initialize the fileWatcher if enabled, to reload the server when the bundle changes.
    config.watch && fileWatcher(config.bundle, srv.reload);

    !config.quiet &&
        console.log(`\x1b[32m@Byndly: 🚀 Bundle now available at 'http://${config.host}:${config.port}'.\x1b[0m`);
})(getEnvArgs());
