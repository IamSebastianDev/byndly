/** @format */

import { root } from '../utils/root';
import { parseConfig } from './parse-config';

const definedLocations = ['/', 'config/', '.config/'];
const definedFiles = ['byndly', 'byndly.config', 'byndlyrc'];
const definedExtensions = ['.js', '.mjs', '.json', ''];

export const findConfigFile = async (): Promise<[Record<PropertyKey, unknown> | null, string | null]> => {
    return new Promise(async (resolve) => {
        let userConfig: Record<PropertyKey, unknown> | null = null;
        let configPath: string | null = null;

        // Iterate over the defined variables to find a config file,
        // and resolve the promise if a file could be found
        iterator: {
            for (const location of definedLocations) {
                for (const name of definedFiles) {
                    for (const ext of definedExtensions) {
                        try {
                            const path = root(location, name + ext);
                            userConfig = await parseConfig(path);
                            configPath = path;
                        } catch (e) {
                            // ignore all errors thrown
                        } finally {
                            // if a userConfig has been successfully assigned,
                            // break the iteration and return the user config
                            if (userConfig) {
                                break iterator;
                            }
                        }
                    }
                }
            }
        }

        resolve([userConfig, configPath]);
    });
};
