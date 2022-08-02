# politeiagui-scripts

This is a CLI that abstracts away the configuration for our plugins and apps for linting, testing, building, prettifying and starting.

## Usage

This is a CLI and exposes a bin called politeiagui-scripts.

## Overriding Config

politeiagui-scripts allows you to specify your own configuration for things. To have your own config, just add the config file (babel.config.js, jest.config.js, .prettierrc, .eslintrc) to your plugin or app and politeiagui-scripts will use that instead of the internal config. You can also add a config file to the workspace if you want.

<!-- TODO: Add docs to install new deps/packages -->

## Commands

### start-app

Runs app in development mode.
Will use `src/public/index.html` as template and `src/index.js` as entrypoint
It will use an `auto` port and automatically open the browser if successful.
The page will automatically reload if you make changes to the code.

### start-plugin

Runs plugin in development mode.
Will use `src/dev/index.html` as template and `src/dev/index.js` as entrypoint
It will use an `auto` port and automatically open the browser if successful.
The page will automatically reload if you make changes to the code.

### test

Runs the test watcher in an interactive mode.
By default, runs tests related to files changed since the last commit.

### test-e2e

Runs e2e tests using cypress. Runs headless tests by default.

```bash
$ cd apps/politeia
# run headless tests
$ politeiagui-scripts test-e2e

# run tests on default browser (chrome)
$ politeiagui-scripts test-e2e --browser

# run tests on custom browser. Must be installed on your computer.
$ politeiagui-scripts test-e2e --browser="firefox"
```

### build-app

Builds the app for production to the dist folder.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed.

### build-plugin

Builds the plugin to the dist folder.
Entrypoint: `src/index.js`.

### lint

Runs eslint.

### prettify

Runs prettier.
