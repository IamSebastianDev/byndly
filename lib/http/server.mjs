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

    const { port, host, verbose } = config;

    // method to launch the server

    const serve = () => {
        const srv = http.createServer(async (req, res) => {
            if (verbose) console.log(`${req.method}::${req.url}`);

            if (req.url === '/') {
                res.writeHead(200);
                res.end(await createTemplate(config));
            } else if (req.url === '/rld') {
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*',
                });
                    reloadObserver.reset();
                reloadObserver.subscribe(() => {
                    res.write('data: { "rld": "true" }\n\n');
                });
            } else {
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
