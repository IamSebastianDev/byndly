/** @format */

import { readFile } from 'fs/promises';
import { extname } from 'path';

export const parseConfig = async (path: string): Promise<Record<PropertyKey, unknown>> => {
    const ext = extname(path);
    switch (true) {
        case ext === '.json':
        case ext === '':
            return JSON.parse(await readFile(path, 'utf-8'));
        case ext === '.js':
        case ext === '.mjs':
        default:
            // A query string is appended to the import to force node to reimport and
            // forego any cached imports.
            const data = await import(`${path}?update=${Date.now()}`).then((module) => module.default);
            // If no data was exported, assume config in file is invalid.
            if (!data) {
                throw new Error(`Provided config file does not export a valid configuration.`);
            }

            return data;
    }
};
