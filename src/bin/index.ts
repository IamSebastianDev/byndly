/** @format */

import { getConfigFile } from '../lib/config/get-config-file';
import { getEnvArgs } from '../lib/config/get-env-args';
import { format } from '../lib/utils/format';
import { createConfig } from '../lib/config/create-config';
import { getPkg } from '../lib/config/get-pkg';
import { validateConfig } from '../lib/config/validate-config';
import { byndly } from '../lib/byndly';
import { createFileWatcher } from '../lib/utils/create-file-watcher';
import { onShutdown } from '../lib/utils/on-shutdown';
import { parseConfig } from '../lib/config/parse-config';
import { spawnSync } from 'node:child_process';
import { open } from '../lib/utils/open';

(async () => {
    const args = getEnvArgs();
    const pkg = getPkg(['type', 'main', 'module'] as const);

    // If there is a 'init' flag set in the args, execute the configuration
    // creation process and exit the runner
    if (args['init']) {
        await createConfig(pkg, (args['c'] ?? args['config']) as string);
        process.exit(0);
    }

    console.clear();
    console.log(format.info(`Parsing environment config...`));
    // get initial config and config-file location...
    const [userConfig, resolvedPath] = await getConfigFile(args['c'] ?? args['config']).then(([config, path]) => {
        return [validateConfig(pkg, args, config ?? {}), path] as const;
    });

    /**
     * The fetched config file location is used to ALSO watch the config file for changes,
     * similar to the bundle file, enabling hot reloading of the config file. However,
     * not all config properties are affected, as some require a restart. This means,
     * that two different file watchers are needed.
     * `configWatcher` watches the config file path provided by the cli or argument. Once
     * the config file changes, the new config is passed to the byndly.setConfig() function
     * which updates the stored config settings.
     * Inside byndly, the `bundleWatcher` tracks changes to the bundle, to reload the application
     * server if changes to the bundle are detected. When the bundle location changes
     * the `bundleWatcher` is closed and recreated to watch the new bundle file
     */

    const _instance = byndly(userConfig);

    if (resolvedPath) {
        const configWatcher = createFileWatcher(resolvedPath);
        configWatcher.subscribe(async () =>
            parseConfig(resolvedPath)
                .then((config) => validateConfig(pkg, args, config ?? {}))
                .then((config) => _instance.setConfig(config)),
        );

        configWatcher.watch();

        onShutdown(async () => configWatcher.close());
    }

    // If the open flag was passed to the terminal,
    // open the default browser and navigate to the correct location
    if (args.open) {
        open(userConfig);
    }
})();
