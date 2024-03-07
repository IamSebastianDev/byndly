/** @format */

import { root } from '../utils/root';
import { assert } from '../utils/assert';
import { format } from '../utils/format';
import { buildConfig } from './build-config';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export const createConfig = async (pkg: Record<PropertyKey, unknown>, path: string | undefined) => {
    if (!path) {
        path = pkg?.type === 'module' ? './byndly.config.mjs' : './byndly.config.js';
    }

    const resolvedPath = root(path);

    try {
        const exists = await assert(resolvedPath, 'file', false);
        if (exists) {
            console.log(format.error(`A config file already exists at the specified location.`));
            process.exit(1);
        }

        const config = await buildConfig(pkg, resolvedPath);
        await assert(join(...path.split('/').slice(0, -1)), 'dir', true);
        await writeFile(resolvedPath, config, 'utf-8');

        console.log(format.success(`🚀 config created at 📦 \x1b[1m${resolvedPath}!\x1b[0m`));
        return;
    } catch (e) {
        console.log(format.error(`Error during creation. ${e}`));
        process.exit(1);
    }
};
