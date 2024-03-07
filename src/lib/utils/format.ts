/** @format */

export const format = {
    error: (message: string) => {
        return `${'\x1b[31m\x1b[1m'}[Byndly:Error]: ${'\x1b[0m\x1b[31m'}${message} ${'\x1b[0m'}`;
    },
    info: (message: string) => {
        return `${'\x1b[36m\x1b[1m'}[Byndly]: ${'\x1b[0m\x1b[36m'}${message} ${'\x1b[0m'}`;
    },
    success: (message: string) => {
        return `${'\x1b[32m\x1b[1m'}[Byndly]: ${'\x1b[0m\x1b[32m'}${message} ${'\x1b[0m'}`;
    },
};
