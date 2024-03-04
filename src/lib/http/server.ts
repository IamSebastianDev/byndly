/** @format */

import { IncomingMessage, Server, ServerResponse, createServer } from 'node:http';
import { ByndlyConfig } from '../types/byndly-config.type';
import { createOnceObservable } from '../utils/create-once-observable';
import { format } from '../utils/format';
import { onShutdown } from '../utils/on-shutdown';
import { requestHandler } from './request-handler';

export const httpServer = () => {
    let server: Server | null = null;
    let config: Required<ByndlyConfig> | null = null;

    const ping = createOnceObservable();

    // Method to start the server using the handler function
    const listen = (_config: Required<ByndlyConfig>) => {
        config = _config;

        if (server) return;
        server = createServer(requestHandler(config, ping));

        const { port, host, quiet } = config;

        if (port && host) {
            server.listen(+port, host);
            if (!quiet) {
                console.log(format.info(`Bundle now available at http://${host}:${port} 📦`));
            }
            return;
        }

        return close();
    };

    // Method to shut down the server and remove all existing connections
    const close = () => {
        if (!server) return;
        if (server.listening) {
            server.closeAllConnections();
            server.close();
            server = null;
        }
    };

    onShutdown(async () => close());

    return {
        listen,
        close,
        reload: () => ping.emit(),
    };
};
