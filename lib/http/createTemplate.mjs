/** @format */

import fs from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const createModuleScript = (bundle, bootstrap) => {
    return `<script type="module">const bootstrap = ${bootstrap.toString()}; import * as bundle from "${bundle}";(() => bootstrap(bundle))();</script>`;
};

const createGlobalScript = (bootstrap) => {
    return `<script>
    (${bootstrap.toString()})()
    </script>`;
};

const createReloadScript = () => {
    return `<script>
    new EventSource('http://$$host$$:$$port$$/rld').addEventListener('message', (ev) => {
        JSON.parse(ev.data).rld && window.navigation.reload();
    });
</script>`;
};

const createIncludes = (includes) => {
    const links = [];
    includes.forEach((link) => {
        switch (true) {
            case link.includes('.js'):
                links.push(`<script src="${link}"></script>`);
                break;
            case link.includes('.mjs'):
                links.push(`<script src="${link}"></script>`);
                break;
            case link.includes('.css'):
                links.push(`<link rel="stylesheet" href="${link}">`);
                break;
        }
    });

    return links.join('\n');
};

const handleHTMLInclude = async (string) => {
    if (!string) return '';

    const lcs = string.toLocaleLowerCase();
    if (lcs.endsWith('.html')) {
        return await fs.readFile(resolve(dirname(fileURLToPath(import.meta.url)), string), 'utf-8');
    }

    return string;
};

/**
 *
 * @param { import("../config/default.config.mjs").UserConfig } config
 */

export const createTemplate = async (config) => {
    const { include, bundle, name, module, port, host, bootstrap, watch, template: htmlInclude } = config;
    const template = await fs.readFile(resolve(dirname(fileURLToPath(import.meta.url)), './template.html'), 'utf-8');
    const htmlToInsert = await handleHTMLInclude(htmlInclude);
    const createRegex = (val) => new RegExp(`\\\$\\\$${val}\\\$\\\$`, 'gim');
    return template
        .replace(createRegex('name'), (r) => name)
        .replace(createRegex('watch'), (r) => (watch ? createReloadScript() : ''))
        .replace(createRegex('port'), (r) => port)
        .replace(createRegex('host'), (r) => host)
        .replace(createRegex('bundle'), (r) => bundle)
        .replace(createRegex('scriptType'), (r) => (module ? 'type="module"' : ''))
        .replace(createRegex('module'), (r) => (module && bootstrap ? createModuleScript(bundle, bootstrap) : ''))
        .replace(createRegex('bootstrap'), (r) => (!module && bootstrap ? createGlobalScript(bootstrap) : ''))
        .replace(createRegex('include'), (r) => (include ? createIncludes(include) : ''))
        .replace(createRegex('body'), (r) => (htmlInclude ? htmlToInsert : ''));
};
