/** @format */

import { readFile } from 'node:fs/promises';
import { fromRoot } from './fromRoot.mjs';

const CONFIG_LOCATIONS = ['/', 'config/', '.config/'];
const CONFIG_NAMES = ['byndly', 'byndly.config', 'byndlyrc'];
const CONFIG_EXT = ['.js', '.mjs', '.json'];

/**
 * Object used to set configuration properties to use with byndly.
 * @typedef { Object } UserConfig
 * @property { string } [bundle] - the path to the bundle / library file that will be included.
 * @property { boolean } [module] - flag indicating if the bundle is a es6 module or not.
 * @property { string | string[] } [include] - string or array of string indicating paths of
 * files to include.
 * @property { Function } [bootstrap] - function included by byndly to bootstrap the dev setup.
 * Receives the exports of the bundle as argument.
 * @property { boolean } [watch] - flag indicating if byndly should reload when changes are detected
 * in the bundle.
 * @property { number | string } [port] - port to use with byndly.
 * @property { string } [host] - host to use with byndly.
 * @property { boolean } [quiet] - flag indicating if logs should be suppressed.
 * @property { boolean } [verbose] - flag indicating if extended logs should be sent to the console. Will log
 * all HTTP requests done by byndly.
 */

/**
 * @description
 * method to retrieve the configuration object, either from the user specified path passed in the process arguments
 * of from one of the default paths that are searched.
 *
 * @param { string } [path] - the optional path argument parsed from the process.args.
 * Can be passed using the --c long flag
 * @returns {Promise<null | UserConfig>} either null if no user config was found, or the found userConfig object.
 */

export const getConfig = async (path) => {
    let userConfig = null;

    if (path) {
        try {
            userConfig = (await import(fromRoot(path))).default;
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
    return userConfig;
};
