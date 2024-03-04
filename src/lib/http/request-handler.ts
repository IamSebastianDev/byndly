/** @format */

import { IncomingMessage, ServerResponse } from 'http';
import { ByndlyConfig } from '../types/byndly-config.type';
import { createOnceObservable } from '../utils/create-once-observable';
import { format } from '../utils/format';
import { fetchTemplate } from './fetch-template';
import { fetchStaticFile } from './fetch-static-file';

export const requestHandler =
    (config: Required<ByndlyConfig>, observer: ReturnType<typeof createOnceObservable>) =>
    async (req: IncomingMessage, res: ServerResponse) => {
        if (config?.verbose && !config?.quiet) console.log(format.info(`${req.method}::${req.url}`));

        switch (req.url) {
            case '/config':
                res.writeHead(200);
                res.end(JSON.stringify(config));
                break;
            // Register the reload handler
            case '/rld':
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*',
                });
                res.write('data: { "connected": "true" }\n\n');
                observer.subscribe(() => {
                    if (!config.quiet) console.log(format.info(`[${new Date().toLocaleTimeString()}] Reloading 📦`));
                    res.write('data: { "rld": "true" }\n\n');
                });
                break;
            // Dispatch the index template
            case '/':
                await fetchTemplate(config, res);
                break;
            // Handle all other, static file requests
            default:
                await fetchStaticFile(req, res);
                break;
        }
    };
