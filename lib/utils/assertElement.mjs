/** @format */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fromRoot } from './fromRoot.mjs';

/**
 *
 * @param { string } path
 * @param { 'dir' | 'file' } type
 * @param { boolean } upsert
 * @returns
 */

export const assertElement = async (path, type, upsert = true) => {
    return new Promise((resolve, reject) => {
        const pathFromRoot = fromRoot(path);
        const elementExist = () => existsSync(pathFromRoot);

        if (!elementExist() && !upsert) {
            reject(`Directory '${path}' does not exist.`);
        }

        if (!elementExist() && upsert) {
            if (type === 'dir') {
                mkdirSync(pathFromRoot);
            } else if (type === 'file') {
                writeFileSync(pathFromRoot, '', 'utf-8');
            }
        }

        if (elementExist()) {
            resolve(true);
        }
    });
};
