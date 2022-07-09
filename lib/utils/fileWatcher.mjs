/** @format */

import { watch } from 'node:fs/promises';

export const fileWatcher = async (src, callback) => {
    const { signal } = new AbortController();
    const watcher = watch(src, { signal, recursive: true });
    for await (const event of watcher) {
        try {
            callback();
        } catch (err) {
            if (err.name === 'AbortError') return;
            throw err;
        }
    }
};
