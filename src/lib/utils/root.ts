/** @format */

import { join, resolve } from 'path';

export const root = (...fragments: string[]) => resolve(join(process.cwd(), ...fragments));
