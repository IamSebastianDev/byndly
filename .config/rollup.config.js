/** @format */

import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import pkg from '../package.json' assert { type: 'json' };
import shebang from 'rollup-plugin-add-shebang';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';

const bundle = (config) => ({
    input: './src/index.ts',
    external: (id) => !/^[./]/.test(id),
    ...config,
});

export default [
    bundle({
        plugins: [commonjs(), resolve(), esbuild(), json(), cleanup({ extensions: ['ts'] })],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: true,
            },
        ],
    }),
    bundle({
        input: './src/bin/index.ts',
        plugins: [
            commonjs(),
            resolve(),
            esbuild(),
            json(),
            cleanup({ extensions: ['ts'] }),
            copy({ targets: [{ src: './src/lib/blocks/**/*', dest: './dist/blocks' }] }),
        ],
        output: [
            {
                format: 'es',
                sourcemap: false,
                plugins: [shebang({ include: `**/*.js` })],
                file: pkg.bin,
            },
        ],
    }),
    bundle({
        output: {
            file: pkg.types,
            format: 'es',
        },
        plugins: [resolve(), commonjs(), cleanup({ extensions: ['.ts'] }), dts()],
    }),
];
