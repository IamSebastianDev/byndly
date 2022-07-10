/** @format */

import { createTemplate } from './createTemplate.mjs';
import http from 'node:http';
import { createObservable } from '../utils/createObservable.mjs';
import { handleStaticFile } from './handleStaticFiles.mjs';

/**
 *
 * @param { import("../config/default.config.mjs").UserConfig } config
 */

export const server = (config) => {
    const reloadObserver = createObservable();

    const { port, host, verbose, quiet } = config;

    // method to launch the server

    const serve = () => {
        const srv = http.createServer(async (req, res) => {
            if (verbose && !quiet) console.log(`\x1b[34m@Byndly: ${req.method}::${req.url}\x1b[0m`);

            switch (req.url) {
                case '/':
                    res.writeHead(200);
                    res.end(await createTemplate(config));
                    break;
                case '/rld':
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Access-Control-Allow-Origin': '*',
                    });
                    reloadObserver.reset();
                    reloadObserver.subscribe(() => {
                        if (verbose && !quiet) console.log(`\x1b[33m@Byndly: 🔗 reloading...\x1b[0m`);
                        res.write('data: { "rld": "true" }\n\n');
                    });
                default:
                    await handleStaticFile(req, res);
            }
        });
        srv.listen(port, host);
    };

    // method to trigger the reload

    const reload = () => {
        reloadObserver.update();
    };

    return {
        serve,
        reload,
    };
};
