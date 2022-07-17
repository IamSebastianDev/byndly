/** @format */

import { fromRoot } from '../utils/fromRoot.mjs';
import { assertElement } from '../utils/assertElement.mjs';
import { writeFile } from 'node:fs/promises';

const config = `/** Byndly config - read more: https://github.com/IamSebastianDev/byndly */

const bootstrap = (exports) => {
    // Your bootstrapping code goes here.
}

/**
 * @type { import("byndly").UserConfig }
 */

export default {
    // indicate that the bundle is a es6 module and needs
    // to be imported to be available
    module: true,
    // the path to the bundle
    bundle: 'your/path/to/your/bundle',
    // the bootstrap function
    bootstrap: bootstrap,
    // reload the browser on changes to the bundle
    watch: true,
    // files to include by Byndly when creating the HTML template
    include: [],
    // the port to use
    port: 31415,
    // the host to use
    host: 'localhost',
    // log additional information to the console
    verbose: true,
    // do not silence the console output
    quiet: false,
    // set a name for the browser window
    name: 'Development setup via Byndly.',
};`;

/**
 * @param { import("../config/mergeConfig.mjs").UserConfig } args
 */

export const createConfig = async (args) => {
    const configPath = args.config || args.c || './byndly.config.mjs';
    const rootPath = fromRoot(configPath);

    try {
        await assertElement(rootPath, 'file', false);
        console.error(`\x1b[31m❗ @Byndly: A config file already exists at the specified location.\x1b[0m`);
        process.exit(1);
    } catch (e) {
        await writeFile(rootPath, config, 'utf-8');
        console.log(`\x1b[32m@Byndly: 🚀 config created at 📦 \x1b[1m${configPath}!\x1b[0m`);
        process.exit(0);
    }
};
