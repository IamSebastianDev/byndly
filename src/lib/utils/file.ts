/** @format */

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const file = (current: string, ...path: string[]) => resolve(dirname(fileURLToPath(current)), ...path);
