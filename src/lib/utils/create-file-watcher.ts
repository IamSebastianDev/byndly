/** @format */

import { watch } from 'fs/promises';
import { format } from './format';

export const createFileWatcher = (path: string) => {
    const _abCtrl = new AbortController();
    const { signal } = _abCtrl;

    const watcher = watch(path, { signal });
    const tasks: Set<() => Promise<void>> = new Set();
    let watching = false;

    return {
        close: () => _abCtrl.abort(),
        subscribe: (task: () => Promise<void>) => {
            tasks.add(task);

            return () => {
                tasks.delete(task);
            };
        },
        watch: async () => {
            if (watching || tasks.size === 0) return;
            watching = true;

            try {
                for await (const event of watcher) {
                    if (event.eventType === 'change') {
                        try {
                            for (const task of tasks.values()) {
                                task();
                            }
                        } catch (e: unknown) {
                            format.error(
                                `Error during execution. Event: ${event.eventType}, ${event.filename}. Error: ${e}`,
                            );
                        }
                    }
                }
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }

                throw err;
            }
        },
    };
};
