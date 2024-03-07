/** @format */

import { EnvArgs } from '../types/env-args.type';

/**
 * Retrieves command-line arguments of the current process and returns them as a dictionary.
 *
 * Node provides an array of strings within the process.argv property.
 * This function parses the provided arguments independently of the used syntax.
 * - Short flags are detected and assigned a `true` boolean value.
 * - Long flags are detected and the next argument is assigned as their value.
 * - If a key-value pair using "=" is detected, the value is split and assigned accordingly.
 * - If no value can be determined, the argument is added to the dictionary with both key and value being the same.
 *
 * @returns { EnvArgs } An object containing the parsed command-line arguments as well as a `raw` property containing all string args.
 */
export const getEnvArgs = (): EnvArgs => {
    // set up args and the dict to return later
    const args = [...process.argv.slice(2)];
    const dict = { raw: args };

    // parse the arguments array
    while (args.length > 0) {
        const arg = args.shift();
        if (!arg) {
            break;
        }

        switch (true) {
            // Handle key value pairs
            case arg.includes('='): {
                const [key, value] = arg.split('=');
                dict[key] = value ?? '';
                break;
            }
            // Handle long flags
            case arg.startsWith('--'): {
                const value = args.shift() ?? true;
                dict[arg.substring(2)] = value;
                break;
            }
            // Handle short flags by assigning a `true` boolean
            case arg.startsWith('-'): {
                dict[arg.substring(1)] = true;
                break;
            }
            // Default fallback assigns arg as key + value
            default: {
                dict[arg] = arg;
                break;
            }
        }
    }

    return dict as EnvArgs;
};
