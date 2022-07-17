<!-- @format -->

# Byndly

Byndly is a lightweight, minimal & dependency free development server with change detection. It is NOT a bundler or HMR. It is meant to simplify development of packages used in a browser environment, where setting up a server/test-site without relevance for the release would pollute the repository or package.

## 🚀 Installation & Usage

### With local installation

Install Byndly via NPM or Yarn. Make sure to add it as development dependency, to not introduce unwanted dependencies into your own package.

```bash
 # will install byndly as devDependency
 $ yarn add byndly -D

 # will install byndly as devDependency
 $ npm i byndly -D
```

Use Byndly with your CLI or as script inside your package.json file.

```bash
# create a minimal server serving the chosen bundle.
$ byndly --b ./dist/bundle.js
```

```jsonc
// package.json
{
    "scripts": {
        "serve": "byndly --b ./dist/bundle.js"
    }
}
```

> Note: Byndly is setup to use as little configuration as possible. 'bundle' is the only necessary option.

By default, Byndly will include your script as a normal JS file, meaning it should be bundled in a way that makes it globally accessible. You can change this behaviour using the [configuration options](#🔧-configuration) below.

### Without local installation

You can also run Byndly directly without installing it. This can be useful for quick prototyping or similar, minimal setups. The only difference between installing and directly executing is the actual installation. All other aspects stay the same.

```bash
 # run Byndly without installation
 $ npx byndly --config 'byndly.config.mjs'
```

## 🔧 Configuration

While Byndly works well without configuration, setting up a config file or passing extended configuration as arguments when calling Byndly can make it easier to customize your developer experience.

### Configuration files

Besides configuring Byndly using CLI arguments, you can also use a configuration file. Byndly will automatically detect config files inside the root directory, or a distinct `config` or `.config` directory. Config files need to be called `byndly`, `byndly.config` or `byndlyrc`. Available extensions are `js`, `mjs` or `json`.

If you prefer another naming conventions or want to be more specific, you can pass the location of your config file to the CLI using the `--c` or `--config` flag.

```bash
 # Load the config file at the specified path
 $ byndly --c ./byndly.configFile.js
```

If your config file is a `.js` or `.mjs` file, it needs to have a default export containing the config properties.

```js
// ES6 style default export
export default {
    //...config
};

// Node style module.export
module.export = {
    //...config
};
```

Using JSON is also possible, however you will not be able to define a bootstrap function.

### Creating a configuration file

Byndly has a special init flag that let's you create a pre scaffold configuration file easily. By default, it will create a `byndly.config.mjs` file in the root of your project. You can specify the path with the `--c` or `--config` flag.

```bash
# create a config file in the root of your project
$ byndly init

# create a config file in the specified location
$ byndly init --c .config/byndly.config.mjs
```

### Configuration properties

#### **`bundle`**

Type: `string`  
CLI: `--b/--bundle/bundle= <string>`

The only required option. This is the path to the bundle served by Byndly. Can be set via the `--b` or `--bundle` flag as well as with the `bundle` property in a byndly config file. Does not have a default value and will throw an error when missing.

#### **`module`**

Type: `boolean`  
CLI: `-m/-module`

Flag indicating if the bundle is a ES6 module and needs to be imported to use with the bootstrap function. Can be set via the `-m` or `-module` short flag indicating a true boolean as well as with the `module` property in a byndly config file. Defaults to false.

#### **`bootstrap`**

Type: `(exports: Record<string, unknown) => void`  
CLI: `/`

Bootstrap function inserted into the DOM. Can be used to create initial code or setup/influence your frontend test environment. Necessary with ES6 modules, as exports will not be added to the global scope. Can be omitted, if your bundle is added to the global scope or executed by itself.

```js
// byndly.config.mjs

const bootstrap = (exports) => {
    // 'exports' contains the exports from your bundled code.
    console.log(exports.ExportedClass);
    // will log the class exported by your bundle.
};

// you can also use destructuring to directly access the exports as argument.
const bootstrap = ({ ExportedClass }) => {
    const created = new ExportedClass();
};
```

You can also use a bootstrap function without a ES6 module. In that case, no arguments will be passed to the function and it will simply be setup to execute automatically when the code is loaded.

```js
// byndly.config.mjs

const bootstrap = () => {
    console.log('loaded');
    // 'loaded'
};
```

> Note: The bootstrap function cannot be defined in the CLI. To use it, you need to create a configuration file.

#### **`watch`**

Type: `boolean`  
CLI: `-w/--watch`

Flag indicating if the browser should reload when changes in the supplied bundle file are detected. Can be set via the `-w` or `-watch` short flag indicating a true boolean as well as with the `watch` property in a byndly config file. Defaults to false.

#### **`port`**

Type: `string | number`  
CLI: `--p/--port/port=<port>`

Property to determine the port used by the Byndly server. Can be set via the `--p` or `--port` long flag followed by a string as well as with the `port` property in a byndly config file. Defaults to `31415`. (🥧)

#### **`host`**

Type: `string`  
CLI: `--h/--host/host=<host>`

Property to determine the host used by the Byndly server. Can be set via the `--h` or `--host` long flag followed by a string as well as with the `host` property in a byndly config file. Defaults to `127.0.0.1`. (localhost)

#### **`name`**

Type: `string`  
CLI: `--n/--name/name=<name>`

Property to determine the name used by the Byndly server displayed in the title bar. Can be set via the `--n` or `--name` long flag followed by a string as well as with the `name` property in a byndly config file. Defaults to `Byndly`.

#### **`quiet`**

Type: `boolean`  
CLI: `-q/-quiet`

Flag indicating if Byndly should suppress all console messages. Can be set via the `-q` or `-quiet` short flag indicating a true boolean as well as with the `quiet` property in a byndly config file. Defaults to false.

#### **`verbose`**

Type: `boolean`  
CLI: `-v/-verbose`

Flag indicating if Byndly should log additional console messages consisting of HTTP requests and reloading events. Can be set via the `-v` or `-verbose` short flag indicating a true boolean as well as with the `verbose` property in a byndly config file. Defaults to false.

#### **`include`**

Type: `string[]`  
CLI: `/`

Array of strings indicating files that should be included client side. The property cannot be set in the CLI and needs to be set in a config file. Accepts `.js`, `.mjs` and `.css` files. `.js` files will be included as simple `script`, `.mjs` files will be included as script `type="module"`.

```js
// byndly.config.mjs
export default {
    // ...
    include: ['./dist/main.css', './dist/externalLibrary.js'],
};

// the css file will be included as stylesheet client side, the js file will be included as script.
```

### Typescript support

Byndly does not have a publicly accessible API and is not meant to be used through the API. However, types exist for the configuration object. They're mostly meant for editor autocompletion via JSDocs, as your config file should not be bundled or transpiled with the rest of your code. As such, Byndly does not support TypeScript config files. Below you can find an extensive example with explanations how a config file might look when used with types.

```js
// byndly.config.mjs

const bootstrap = (exports) => {
    // 'exports' contains the exports of your bundle file.
};

/**
 * This will import the types from Byndly and enable suggestions and
 * documentation inside the config object.
 * The object below is a complete example of how a config object might look like.
 * @type { import("byndly").UserConfig }
 */

export default {
    // indicate that the bundle is a es6 module and needs
    // to be imported to be available
    module: true,
    // the path to the bundle
    bundle: './dist/index.esm.js',
    // the bootstrap function
    bootstrap: bootstrap,
    // reload the browser on changes to the bundle
    watch: true,
    // files to include by Byndly when creating the HTML template
    include: ['./dist/main.css'],
    // the port to use
    port: 3000,
    // the host to use
    host: 'localhost',
    // log additional information to the console
    verbose: true,
    // do not silence the console output
    quiet: false,
    // set a name for the browser window
    name: 'Development setup via Byndly.',
};
```

## 📋 License

Byndly is licensed under the [MIT License](https://opensource.org/licenses/MIT).
