/** @format */

import { parse } from 'url';
import { ByndlyConfig } from '../types/byndly-config.type';
import { spawn } from 'child_process';
import { format } from './format';

export const open = ({ port, host }: ByndlyConfig) => {
    if (!port || !host) throw new Error();
    const url = parse(`http://${host}:${port}`, true);

    const command = {
        darwin: 'open',
        win32: 'explorer.exe',
        linux: 'xdg-open',
    };
    const proc = spawn(command[process.platform], [url.href]);
    proc.on('error', (err) => {
        console.log(format.error(err.message));
    });
};
