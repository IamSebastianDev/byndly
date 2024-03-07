<!-- @format -->
<p align="center">
    <img src="https://repository-images.githubusercontent.com/512277314/4c07bbca-bf4c-46d7-bddf-a271ab02968f" alt="logo"/>
</p>

# Byndly

Byndly is a modern, zero-config, dependency-free development server, featuring hot-reloading and change detection. It is NOT a bundler or HMR. It is meant to simplify development of packages used in a browser environment, where setting up a server/test-site without relevance for the release would pollute the repository or package.

## Installation & Usage

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
$ byndly
```

```jsonc
// package.json
{
    "scripts": {
        "serve": "byndly,
    },
}
```

> Note: Byndly is setup to run without any configuration if desired, and will serve the 'main' or 'module' field as bundle if not otherwise instructed.

By default, Byndly will include your script as a normal JS file, meaning it should be bundled in a way that makes it globally accessible. You can change this behaviour using the [configuration options](#configuration) below.

### Without local installation

You can also run Byndly directly without installing it. This can be useful for quick prototyping or similar, minimal setups. The only difference between installing and directly executing is the actual installation. All other aspects stay the same.

```bash
 # run Byndly without installation
 $ npx byndly
```

## Configuration

While Byndly works well without configuration, setting up a config file or passing extended configuration as arguments when calling Byndly can make it easier to customize your developer experience, or to fit into different development environments.

### Configuration files

Besides configuring Byndly using CLI arguments, you can also use a configuration file. Byndly will automatically detect config files inside the root directory, or a distinct `config` or `.config` directory. Config files need to be called `byndly`, `byndly.config` or `byndlyrc`. Available extensions are `js`, `mjs` or `json`.

If you prefer another naming conventions or want to be more specific, you can pass the location of your config file to the CLI using the `--c` or `--config` flag.

```bash
 # Load the config file at the specified path
 $ byndly --c ./byndly.configFile.js
```

If your config file is a `.js` or `.mjs` file, it needs to have a default export containing the config properties. This is best done using the `defineConfig` function, exposed by the `byndly` package. Using the function will give you autocomplete and type-safety.

```js
// ES6 style default export
import { defineConfig } from 'byndly';

export default defineConfig({
    //...config
});

// Node style module.export
const { defineConfig } = require('byndly');

module.export = defineConfig({
    //...config
});
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

This is the path to the bundle served by Byndly. Can be set via the `--b` or `--bundle` flag as well as with the `bundle` property in a byndly config file. Defaults to the `main` field of your `package.json`, or if the `"type": "module"` property is set, to the `module` field of the `package.json`.

#### **`module`**

Type: `boolean`  
CLI: `-m/-module`

Flag indicating if the bundle is a ES6 module and needs to be imported to use with the bootstrap function. Can be set via the `-m` or `-module` short flag indicating a true boolean as well as with the `module` property in a byndly config file. Defaults to whatever value is set to the `type` field in the `package.json`.

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

> Note: The bootstrap function cannot be defined in the CLI. To use it, you need to create a `.js` or `.mjs` configuration file.

#### **`watch`**

Type: `boolean`  
CLI: `-w/--watch`

Flag indicating if the browser should reload when changes in the supplied bundle file are detected. Can be set via the `-w` or `-watch` short flag indicating a true boolean as well as with the `watch` property in a byndly config file. Defaults to true.

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

Property to determine the name used by the Byndly server displayed in the title bar. Can be set via the `--n` or `--name` long flag followed by a string as well as with the `name` property in a byndly config file. Defaults to the name of your package defined in the `package.json`.

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

#### **`template`**

Type: `string`  
CLI: `--t/--template/--template=<path>`

A optional string indicating a path to a HTML file or a html string, that will be inserted into the body of the created template. This can be used to quickly setup a DOM testing suite or elements needed to test or work on the library.

## Contributing

If you would like to contribute, take a look at the [contribution guide](./contributing.md).

## License

Byndly is licensed under the [MIT License](https://opensource.org/licenses/MIT).
