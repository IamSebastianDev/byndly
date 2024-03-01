/** @format */

import { ByndlyConfig } from '../types/byndly-config.type';

export const checkConfigMatch = (prev: ByndlyConfig, curr: ByndlyConfig): boolean => {
    // Check if all the hot reloadable properties are the same
    // to decide if the configs still match
    const properties: (keyof ByndlyConfig)[] = ['bootstrap', 'bundle', 'include', 'quiet', 'template', 'verbose'];
    return Object.entries(curr)
        .filter(([key]) => properties.includes(key as keyof ByndlyConfig))
        .every(([key, value]) => prev[key]?.toString() == value?.toString());
};
