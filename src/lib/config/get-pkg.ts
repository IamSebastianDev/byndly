/** @format */

import { readFileSync } from 'fs';
import { root } from '../utils/root';
import { format } from '../utils/format';

export const getPkg = <T extends string[]>(extractKeys: T): Record<T[number], unknown> => {
    try {
        const pkg = readFileSync(root('package.json'), 'utf-8');
        const parsed: Record<PropertyKey, unknown> = JSON.parse(pkg);

        return Object.fromEntries(Object.entries(parsed).filter(([key]) => extractKeys.includes(key))) as Record<
            T[number],
            unknown
        >;
    } catch (e) {
        console.log(format.error(e));
        process.exit(1);
    }
};
