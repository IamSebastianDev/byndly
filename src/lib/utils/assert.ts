/** @format */

import { existsSync, mkdirSync, writeFileSync } from 'fs';

export const assert = async (path: string, type: 'dir' | 'file', upsert = true) => {
    return new Promise<boolean>((res) => {
        const elementExist = () => existsSync(path);

        if (!elementExist() && !upsert) {
            res(false);
        }

        if (!elementExist() && upsert) {
            if (type === 'dir') {
                mkdirSync(path, { recursive: true });
            } else if (type === 'file') {
                writeFileSync(path, '', 'utf-8');
            }
        }

        if (elementExist()) {
            res(true);
        }
    });
};
