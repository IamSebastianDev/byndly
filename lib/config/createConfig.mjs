/** @format */

import { fromRoot } from '../utils/fromRoot.mjs';
import { assertElement } from '../utils/assertElement.mjs';
import { writeFile, readdir, readFile } from 'node:fs/promises';
import { extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const fromFile = (path) => resolve(dirname(fileURLToPath(import.meta.url)), path);
const buildConfig = async (ext) => {
    const parts = await readdir(fromFile('./configBlocks'));
    const blocks = await Promise.all(
        parts.map(async (path) => {
            return {
                name: path.split('.')[0],
                content: await readFile(fromFile('./configBlocks/' + path), 'utf-8'),
            };
        })
    );

    const getPart = (string) => blocks.find((block) => block.name === string).content;
    const packageName = JSON.parse(await readFile(fromRoot('./package.json'))).name || '';

    switch (ext) {
        case '.mjs':
            return (
                getPart('head') +
                getPart('export').replace('$$props$$', getPart('props').replace('$$name$$', packageName))
            );
        case '.js':
            return (
                getPart('head') +
                getPart('module').replace(
                    '$$props$$',
                    getPart('props').replace('$$name$$', `Serving bundle ${packageName}`)
                )
            );
        default:
            console.error(
                `\x1b[31m❗ @Byndly: ${ext} not recognized as a valid config file extension. Use '.js' or '.mjs'.\x1b[0m`
            );
            process.exit(1);
    }
};

/**
 * @param { import("../config/mergeConfig.mjs").UserConfig } args
 */

export const createConfig = async (args) => {
    const configPath = args.config || args.c || './byndly.config.mjs';
    const rootPath = fromRoot(configPath);
    const config = await buildConfig(extname(rootPath));

    try {
        await assertElement(rootPath, 'file', false);
        console.error(`\x1b[31m❗ @Byndly: A config file already exists at the specified location.\x1b[0m`);
        process.exit(1);
    } catch (e) {
        await writeFile(rootPath, config, 'utf-8');
        console.log(`\x1b[32m@Byndly: 🚀 config created at 📦 \x1b[1m${configPath}!\x1b[0m`);
        process.exit(0);
    } finally {
        process.exit(0);
    }
};
