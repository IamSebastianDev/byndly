/** @format */

import { argv } from 'process';

/**
 * Utility method to extract the environment arguments passed to the execution call and return them as a key value pair
 * object. The method is capable of detecting -shortFlags, --longFlags and key=value pairs.
 *
 * @returns { {} } an Object containing the argument=value pairs as named properties.
 */

export const getEnvArgs = () => {
    const args = {};

    /**
     * Node provides a array of strings within the process.argv property.
     * To parse the provided arguments independent of the used syntax a for loop is used.
     * If a short flag is detected, a true boolean is indicated
     * If a long flag is detected, the i+1 value is assigned
     * If a "=" value is detected, the value is split into key, value and assigned as such.
     * If no value can be determined, the element is simply added to the args{} with the key and value equal.
     */

    const rRegEx = /\-/gim;

    for (let i = 2; i < argv.length; i++) {
        const string = argv[i];
        const value = argv[i + 1];
        if (string.includes('=')) {
            const [key, value = true] = string.split('=');
            args[key.replace(rRegEx, '')] = value;
        } else if (string.slice(0, 2) === '--') {
            args[string.replace(rRegEx, '')] = value;
            i++;
        } else if (string[0] === '-') {
            args[string.replace(rRegEx, '')] = true;
        } else {
            args[argv[i]] = argv[i];
        }
    }

    return args;
};
