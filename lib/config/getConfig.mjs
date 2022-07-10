/** @format */

import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { fromRoot } from '../utils/fromRoot.mjs';

const CONFIG_LOCATIONS = ['/', 'config/', '.config/'];
const CONFIG_NAMES = ['byndly', 'byndly.config', 'byndlyrc'];
const CONFIG_EXT = ['.js', '.mjs', '.json'];

/**
 * @description
 * method to retrieve the configuration object, either from the user specified path passed in the process arguments
 * of from one of the default paths that are searched.
 *
 * @param { string } [path] - the optional path argument parsed from the process.args.
 * Can be passed using the --c long flag
 * @returns {Promise<null | import("./mergeConfig.mjs").UserConfig >} either null if no user config was found, or the found userConfig object.
 */

export const getConfig = async (path) => {
    let userConfig = null;

    if (path) {
        try {
            if (extname(fromRoot(path)) === 'json') {
                userConfig = JSON.parse(await readFile(path, 'utf-8'));
            } else {
                userConfig = (await import(fromRoot(path))).default;
            }
        } catch (e) {
            throw new Error(`@Byndly/getConfig: ${e}`);
        }
    } else {
        itt: for (const location of CONFIG_LOCATIONS) {
            for (const name of CONFIG_NAMES) {
                for (const ext of CONFIG_EXT) {
                    try {
                        const path = fromRoot(location, name + ext);

                        if (ext === '.json') {
                            userConfig = JSON.parse(await readFile(path, 'utf-8'));
                        } else {
                            userConfig = (await import(path)).default;
                        }
                    } catch (e) {
                    } finally {
                        if (userConfig) break itt;
                    }
                }
            }
        }
    }

    if (!userConfig) {
        console.error(`\x1b[33m@Byndly: No configuration file detected. Running in arguments mode.\x1b[0m`);
    }

    return userConfig;
};
