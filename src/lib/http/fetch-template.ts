/** @format */

import { ServerResponse } from 'http';
import { ByndlyConfig } from '../types/byndly-config.type';
import { readFile } from 'fs/promises';
import { file } from '../utils/file';
import { root } from '../utils/root';
import { createTag } from '../utils/create-tag';

/**
 * Local function definitions
 */

const createTemplateBody = async (template: ByndlyConfig['template'] = '') => {
    return template.toLocaleLowerCase().endsWith('.html') ? await readFile(root(template), 'utf-8') : template;
};

const createFileIncludes = async (includes: ByndlyConfig['include'] = []) => {
    return includes.map((file) => createTag(file)).join('\n');
};

const createBootstrapInclude = async (bootstrap: string, { bundle, module }: ByndlyConfig) => {
    // If no bootstrap script has been defined, return early
    if (!bootstrap) return '';
    return module
        ? `<script type="module">const b = ${bootstrap}; import * as s from "${bundle}"; b(s)</script>`
        : `<script>(${bootstrap})()</script>`;
};

const createReloadScript = async ({ port, host }: Required<ByndlyConfig>) => {
    return (await readFile(file(import.meta.url, '../blocks/reload.txt'), 'utf-8'))
        .replace(`$$port$$`, `${port}`)
        .replace(`$$host$$`, host);
};

export const fetchTemplate = async (config: Required<ByndlyConfig>, res: ServerResponse) => {
    const template = await readFile(file(import.meta.url, '../blocks/template.txt'), 'utf-8');
    const html = template
        .replace('$$name$$', config.name ?? '')
        .replace('$$include$$', await createFileIncludes(config.include))
        .replace('$$scriptType$$', config.module ? 'type="module"' : '')
        .replace('$$bundle$$', config.bundle)
        .replace('$$bootstrap$$', await createBootstrapInclude(config.bootstrap?.toString(), config))
        .replace('$$watch$$', config.watch ? await createReloadScript(config) : '')
        .replace('$$body$$', await createTemplateBody(config.template));

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(html, 'utf-8');
};
