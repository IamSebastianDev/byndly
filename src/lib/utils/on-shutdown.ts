/** @format */

export const onShutdown = (handler: () => Promise<void>) => {
    ['SIGTERM', 'SIGINT', 'exit'].forEach((eventSource) => {
        process.on(eventSource, () => {
            handler();
        });
    });
};
