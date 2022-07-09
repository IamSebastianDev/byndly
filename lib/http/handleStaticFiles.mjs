/** @format */

import { extname } from 'node:path';
import fs from 'node:fs/promises';

/**
 * Method to handle static resource requests not covered by the event or index route.
 */

export const handleStaticFile = async (req, res) => {
    const path = '.' + req.url;
    const ext = extname(path);
    let contentType = 'text/html';

    // return early if the request is for the favicon
    if (req.url.includes('ico')) return;

    switch (ext) {
        case '.js':
        case '.mjs':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    try {
        const file = await fs.readFile(path, 'utf-8');
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(file, 'utf-8');
    } catch (e) {}
};
