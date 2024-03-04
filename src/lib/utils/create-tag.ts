/** @format */

import { extname } from 'path';

export const createTag = (file: string) => {
    const ext = extname(file);
    return (
        {
            '.js': (link: string) => `<script src="${link}"></script>`,
            '.mjs': (link: string) => `<script src="${link}" type="module"></script>`,
            '.css': (link: string) => `<link rel="stylesheet" href="${link}"></link>`,
        }[ext] ?? (() => ``)
    )(file);
};
