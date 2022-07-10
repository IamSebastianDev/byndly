/** @format */

export type UserConfig = {
    /**
     * @type { string }
     * @description
     * The path of the file/bundle/library to include. Does not have a default,
     * but can be set via the --b or bundle=<string> flag in the arguments when
     * calling byndly.
     */
    bundle?: string;
    /**
     * @type { boolean }
     * @description
     * Flag indicating if the bundle is a es6 module or a iife. This will
     * lead to slightly different ways of serving the file to the browser.
     * Defaults to `false`. Can also be set via the `-m` short flag as true.
     */
    module?: boolean;
    /**
     * @type { string[] }
     * @description
     * Optional array of strings of files to include. Valid files are CSS
     * and JS/MJS files. Other files will be ignored.
     */
    include?: string[];
    /**
     * @type { (args: Record<string, unknown) => void }
     * @description
     * Function used to bootstrap the served file, if the file is not a
     * iife or needs additional configuration.
     */
    bootstrap?: (args: Record<string, unknown>) => void;
    /**
     * @type { boolean }
     * @description
     * Flag indicating if the browser should reload when the bundle changes.
     * Defaults to true.
     */
    watch?: boolean;
    /**
     * @type { number | string }
     * @description
     * The port used by byndly. Defaults to 31415. Can be set using the --p flag
     * or the port=<string> argument when calling byndly.
     */
    port?: number | string;
    /**
     * @type { string }
     * @description
     * The host used by byndly. Defaults to 127.0.0.1. Can be set using the --h flag
     * or the host=<string> argument when calling byndly.
     */
    host?: string;
    /**
     * @type { boolean }
     * @description
     * Flag indicating if log messages should be suppressed. Default to false.
     * Can also be set using the -q flag to enable or the quiet=<string> argument when
     * calling byndly.
     */
    quiet?: boolean;
    /**
     * @type { boolean }
     * @description
     * Flag indicating if additional log messages should be dispatched. Default to false.
     * Can also be set using the -v flag to enable or the verbose=<string> argument when
     * calling byndly. Currently additional logs consist of requests and reloads.
     */
    verbose?: boolean;
};
