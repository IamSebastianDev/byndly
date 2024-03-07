/** @format */

import { format } from '../utils/format';
import { root } from '../utils/root';
import { findConfigFile } from './find-config-file';
import { parseConfig } from './parse-config';

export const getConfigFile = async (
    path: string | boolean | undefined,
): Promise<[Record<PropertyKey, unknown> | null, string | null]> => {
    // If no path is provided, we try to find a config file by searching from the root directory
    if (typeof path !== 'string') {
        return await findConfigFile();
    }

    // If a path variable was passed, try to access and return it
    try {
        return [await parseConfig(root(path)), root(path)];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log(format.error(`Error trying to parse the provided config file: ${err.message}`));
        }
    }

    return [null, null];
};
