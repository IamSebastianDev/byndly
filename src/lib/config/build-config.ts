/** @format */

import { readFile, readdir } from 'fs/promises';
import { file } from '../utils/file';
import { extname } from 'path';
import { format } from '../utils/format';

export const buildConfig = async (pkg: Record<PropertyKey, unknown>, path: string) => {
    const ext = extname(path);
    const parts = await readdir(file(import.meta.url, '../blocks'));
    const blocks = Object.fromEntries(
        await Promise.all(
            parts.map(async (path) => {
                return [
                    path.split('.')[0],
                    (await readFile(file(import.meta.url, '../blocks/' + path), 'utf-8')) as string,
                ];
            }),
        ),
    );

    const config = blocks['props']
        .replace('$$name$$', pkg.name ? `'${pkg.name}'` : 'undefined')
        .replace('$$module$$', pkg.type === 'module');

    switch (ext) {
        case '.mjs':
            return blocks['module'].replace('$$props$$', config);

        case '.js':
            return blocks['common'].replace('$$props$$', config);

        default:
            console.log(format.error(`${ext} not recognized as a valid config file extension. Use '.js' or '.mjs'.`));
            process.exit(1);
    }
};
