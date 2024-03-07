/** @format */

import { IncomingMessage, ServerResponse } from 'http';
import { extname } from 'path';
import { parse } from 'url';
import { root } from '../utils/root';
import { mimeTypes } from '../utils/mine-types';
import { readFile } from 'fs/promises';

export const fetchStaticFile = async (request: IncomingMessage, response: ServerResponse) => {
    const url = parse(request.url ?? '', true);
    const path = root(url.pathname ?? 'index.html');
    const ext = extname(path);
    const mime: string = mimeTypes[ext] ?? 'text/html';

    try {
        const file = await readFile(path, 'utf-8');
        response.setHeader('Content-Type', mime);
        response.writeHead(200);
        response.end(file);
    } catch (err: unknown) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('404 - Not Found');
    }
};
