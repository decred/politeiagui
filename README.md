# Politeia GUI

[![Build Status](https://github.com/decred/politeiagui/workflows/Build%20and%20Test/badge.svg)](https://github.com/decred/politeiagui/actions)

Politeiagui is the web frontend used for [Politeia](https://github.com/decred/politeia). Currently,
there are two different systems built on top of Politeia and both uses Politeiagui as the web client. They are:

- Decred's [proposal system](https://proposals.decred.org/).
- Decred's [contractor management system](https://cms.decred.org/) ("CMS").

## Requirements

Politeiagui uses node.js and the yarn package manager.

- [node](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/)
- [politeiawww](https://github.com/decred/politeia)

  **Note:** Politeiagui can be run as a standalone application that uses mock APIs to simulate communicaiton with the Politeia backend (useful if you're only doing UI changes). In this case, `politeiawww` isn't needed. However, be aware that the Mock APIs are not always up-to-date with the latest changes.

## Development

1. Clone this repository

   `https://github.com/decred/politeiagui.git`

2. Build and run locally.

   **Against politeiawww**

   To run politeiagui against `politeiawww`, make sure `politeiawww` is running and use the following command:

   - Run the Proposal app: `yarn && yarn start`
   - Run the CMS app: `yarn && yarn start:cms`

   **Switching between Proposals and CMS**

   You can have two separate data directories for Proposals and CMS. Use the `--datadir=` flag when starting politeiad and pass a different directory for each app. For example:

   `politeiad --buildcache --datadir="~/Library/Application\ Support/Cms"`

   Doing this, you don't have to erase and populate your DB again when switching from one app to another.

   **Mock APIs (WARNING: may be out of date)**

   To run politeiagui using mock APIs that do not communicate with `politeiawww` (useful for working on UI changes only), run the following command:

   `yarn && yarn uidev`

## Production

To build politeiagui for production deployment, use the following commands:

- Build the Proposal app: `yarn && yarn build`
- Build the CMS app: `yarn && yarn build:cms`

These commands use [create-react-app](https://create-react-app.dev/) to create
production builds of politeiagui.  See the deployment
[documentation](https://create-react-app.dev/docs/deployment/) for instructions
on deploying the builds.

## Configuration

Politeiagui allow customization of settings and features toggling by providing a set of configuration options. The configuration is loaded based on the "preset name" which must be
provided through an enviroment variable called "REACT_APP_PRESET".

The configs can be found inside `src/apps/<preset_name>`.

Currently, two presets are supported, they are:

- politeia: the set of configurations for the Proposals website.
- cms: the set of configurations for the Contractor Managament System.

The full table of configuration options is presented below:

| Option               | POLITEIA (default)                | CMS                          | Description                                                                                                      |
| -------------------- | --------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| title                | "Politeia"                        | "Contractor Management"      | The title to be used for the website                                                                             |
| logoLight            | "pi-logo-light.svg"               | "cms-logo-light.svg"         | Indicates what is the name of the light logo file under `src/assets/images`                                      |
| logoDark             | "pi-logo-dark.svg"                | "cms-logo-dark.svg"          | Indicates what is the name of the dark logo file under `src/assets/images`                                       |
| recordType           | "proposal"                        | "invoice"                    | The main record type name                                                                                        |
| enableAdminInvite    | false                             | true                         | To enable or not the UI elements required for admin invite                                                       |
| enableCommentVote    | true                              | false                        | To enable or not the vote on comments                                                                            |
| paywallContent       | "paywall-politeia"                | ""                           | Indicates what is the name of the markdown file under `src/assets/copies` to be used for the paywall copy        |
| privacyPolicyContent | "privacy-policy"                  | "privacy-policy-cms"         | Indicates what is the name of the markdown file under `src/assets/copies` to be used for the privacy policy copy |
| navMenuPaths         | see src/apps/politeia/config.json | see src/apps/cms/config.json | Custom menu paths to be shown in the navigation menu dropdown                                                    |

**Important:** Currently it's only possible to use the CMS or the POLITEIA presets fully. If you want to create your own app config, you'll need to modify the code and the API accordingly.

## Testing

Politeiagui has unit tests for its core logic. To run all unit tests run the command:

    yarn test

Test coverage is currently provided for (`actions/*`), (`lib/*, reducers/*`) and (`selectors/*`).

Relevant libraries/modules used for testing are:

- [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) - Javascript testing
- [fetch-mock](https://www.wheresrhys.co.uk/fetch-mock/) - Mock http requests
- [redux-mock-store](https://github.com/dmitry-zaets/redux-mock-store) and [redux-actions-assertions](https://github.com/redux-things/redux-actions-assertions) for testing redux actions.

## E2E tests

Politeiagui has e2e tests using `cypress` and `react-testing-library/cypress`. Backend should be running when running e2e tests.

Before running the e2e tests make sure to:

 1. Run `/teste2e/setup-test-users.sh` script to setup the users needed for the tests.
 2. Enable paywall on backend side.

There are two ways two run the e2e tests, either in terminal or in browser:

1. To run e2e tests in terminal use: `test:e2e:run`.
2. To run e2e tests in browser use: `test:e2e:browser`. 

## Contributing

We encourage you to contribute to Politeiagui. Please check [How to contribute to Politeiagui](../master/CONTRIBUTING.md) for guidelines about how to proceed.

## Docker

Politeiagui can also be hosted in a docker container. To build the the docker container, run the following commands:

```bash
$ ./bin/build.sh
```

Then run the container with:

```bash
$ docker run -d --rm -p <local port>:80 decred/politeiagui:latest
```

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
