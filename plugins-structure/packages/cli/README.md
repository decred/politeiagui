# Politeiagui CLI

A command line interface for managing politeiagui plugins and apps. It uses the
[Commander.js](https://github.com/tj/commander.js/) for managing the command
line structure and arguments.

## Overview

- [Politeiagui CLI](#politeiagui-cli)
  - [Overview](#overview)
  - [Setup](#setup)
  - [Creating a new plugin](#creating-a-new-plugin)
  - [Creating a new application](#creating-a-new-application)

## Setup

Installation is pretty simple:

```bash
# navigate to the plugins-structure dir
$ cd plugins-structure

# install the CLI
$ npm install -g .
# or locally
$ cd packages/cli && yarn link
```

How to uninstall `pgui` CLI

```bash
# navigate to the plugins-structure dir
$ cd plugins-structure

# uninstall the CLI
$ npm uninstall -g .
# or locally
$ cd packages/cli && yarn unlink
```

Check your installation using the `pgui help` command:

```bash
$ pgui help
Usage: pgui [options] [command]

Options:
  -V, --version                      output the version number
  -h, --help                         display help for command

Commands:
  newplugin [options] [plugin-name]  Creates a new plugin
  newapp [options] [app-name]        Creates a new app-shell
  help [command]                     display help for command
```

## Creating a new plugin

Let's take a look at the `newplugin` command details:

```bash
Usage: pgui newplugin [options] [plugin-name]

Creates a new plugin

Options:
  -p, --port <port>  port number (default: 3000)
  -h, --help         display help for command
```

Creating a new `ticketvote` plugin:

```bash
$ pgui newplugin ticketvote

Creating a new plugin: ticketvote
Directory: /Directory/plugins-structure/packages/ticketvote



Creating plugin files...
Done!
```

Now, if you navigate to `packages/ticketvote`, you'll have the following
file structure:

```
packages/ticketvote
├── jest.config.js
├── package.json
├── src
│   ├── index.html
│   └── index.js
├── webpack.common.js
├── webpack.dev.js
└── webpack.prod.js
```

Let's take a look under the `package.json`:

```json
{
  "name": "@politeiagui/ticketvote",
  "main": "dist/main.js",
  "version": "1.0.0",
  "module": "src/index.js",
  "license": "MIT",
  "scripts": {
    "prettier": "prettier \"src/**/*.js\"",
    "format": "yarn prettier --write",
    "test:format": "yarn prettier --check",
    "test:eslint": "eslint --ext .js ./src",
    "test:ci": "npm run test:format && npm run test:eslint && cross-env jest --no-cache",
    "test:dev": "npm run test:format && npm run test:eslint && cross-env jest --watchAll --no-cache",
    "test": "is-ci \"test:ci\" \"test:dev\"",
    "test:coverage": "yarn test:ci; open coverage/lcov-report/index.html",
    "build": "webpack --config webpack.prod.js",
    "start": "webpack serve --config webpack.dev.js --open"
  },
  "dependencies": {
    "@politeiagui/core": "1.0.0"
  },
  "devDependencies": {}
}
```

## Creating a new application

Let's take a look at the `newapp` command details:

```bash
Usage: pgui newapp [options] [app-name]

Creates a new app-shell

Options:
  -p, --port <port> port number (default: 3000)

  --plugins [plugins] list of plugins comma separated. Will be ignored if a config file is provided. Example: ticketvote,comments

  --config [config] custom config file relative to this folder. Example: ./config.json

  -h, --help  display help for command
```

Creating a new Proposals app

```bash
$ pgui newapp proposals
Creating a new app: proposals
Directory: /Directory/apps/proposals



Creating app files...
Done!
```

Now, if you navigate to `apps/proposals`, you'll have the following
file structure:

```
apps/proposals
├── jest.config.js
├── package.json
├── src
│   ├── index.js
│   └── public
│       └── index.html
├── webpack.common.js
├── config.json
├── webpack.dev.js
└── webpack.prod.js
```

Let's take a look under the `package.json`:

```json
{
  "name": "proposals",
  "version": "1.0.0",
  "main": "dist/main.js",
  "module": "src/index.js",
  "license": "MIT",
  "scripts": {
    "prettier": "prettier \"src/**/*.js\"",
    "format": "yarn prettier --write",
    "test:format": "yarn prettier --check",
    "test:eslint": "eslint --ext .js ./src",
    "test:ci": "npm run test:format && npm run test:eslint && cross-env jest --no-cache",
    "test:dev": "npm run test:format && npm run test:eslint && cross-env jest --watchAll --no-cache",
    "test": "is-ci \"test:ci\" \"test:dev\"",
    "test:coverage": "yarn test:ci; open coverage/lcov-report/index.html",
    "build": "webpack --config webpack.prod.js",
    "bundle-report": "webpack-bundle-analyzer --port 4200 dist/stats.json",
    "start": "webpack serve --config webpack.dev.js --open"
  },
  "dependencies": {
    "@politeiagui/core": "1.0.0",
    "@politeiagui/common-ui": "1.0.0"
  },
  "devDependencies": {
    "webpack-bundle-analyzer": "^4.4.2"
  }
}
```

And your `config.json` will look like this:

```json
{
  "plugins": {}
}
```

You can provide a config file to tell which plugins you want. To add the ticketvote plugin, for example, you can use this config file:

```json
{
  "plugins": {
    "ticketvote": {
      "version": "1.0.0"
    }
  }
}
```

With the following command:

```bash
$ pgui newapp proposals --config="./config-example.json"
```

You can also pass a list of comma-separated plugins via the plugins option. For example:

```bash
$ pgui newapp proposals --plugins="comments,ticketvote"
```

Notice that if you send both a plugins list and a config file, the plugins list will be ignored.
