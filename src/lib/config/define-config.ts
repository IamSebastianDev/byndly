/** @format */

import { ByndlyConfig } from '../types/byndly-config.type';

/**
 * This function is exposed by byndly to simplify config creation. Use it to create and export the config.
 *
 * ```ts
 * import {defineConfig} from "byndly";
 *
 * export default defineConfig({
 *   // ...config properties
 * })
 * ```
 *
 * @param {Partial<ByndlyConfig>} config - The configuration object provided to the function.
 * @returns
 */
export const defineConfig = (config: Partial<ByndlyConfig>) => config;
