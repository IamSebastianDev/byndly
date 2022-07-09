/** @format */
import { resolve } from 'node:path';

/**
 * @description
 * Utility method to construct paths from the root of the project.
 *
 * @param  {...string} fragments - the string fragments to concat
 * @returns { string } the constructed absolute path.
 */

export const fromRoot = (...fragments) => resolve(process.cwd(), ...fragments);
