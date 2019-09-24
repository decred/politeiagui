# Politeia GUI

[![Build Status](https://github.com/decred/politeiagui/workflows/Build%20and%20Test/badge.svg)](https://github.com/decred/politeiagui/actions)

Politeiagui is the web frontend used for [Politiea](https://github.com/decred/politeia). Currently, 
there are two different systems built on top of Politeia and both uses Politeiagui as the web client. They are:
- Decred's [proposal system](https://proposals.decred.org/). 
- Decred's [contractor management system](https://cms.decred.org/).


## Requirements

Politeiagui uses node.js and the yarn package manager. 

- [node](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/)
- [politeiawww](https://github.com/decred/politeia)

    **Note:**  Politeiagui can be run as a standalone application that uses mock APIs to simulate communicaiton with the Politeia backend (useful if you're only doing UI changes). In this case, `politeiawww` isn't needed. However, be aware that the Mock APIs are not always up-to-date with the latest changes. 



## Development

**Important:** Politeiagui is currently going through a UI redesign and code refactoring. Hence, the previous implementation is being replaced to what we call "politeiagui v2" (or just "v2"). If you want to run the new version skip to [this section instead.](#development-for-v2) The version 2 is, so far, only working for the proposals system. For CMS use the setup below.

1. Clone this repository

    `https://github.com/decred/politeiagui.git`
    

1. Build and run locally.

    **Against politeiawww**
    
    To run politeiagui against `politeiawww`, make sure `politeiawww` is running and use the following command:
    
    `yarn && yarn start`

    **Mock APIs (WARNING: may be out of date)**

    To run politeiagui using mock APIs that do not communicate with `politeiawww` (useful for working on UI changes only), run the following command:
    
    `yarn && yarn uidev`

## Production

To build politeiagui for production deployment, use the following commands:

    yarn && yarn build
    ls build


## Development for v2

1. Clone this repository
2. Install the dependencies and run the application: 
`yarn && yarn start-v2`
    
## Production for v2
Install the dependencies and build the application:
`yarn && yarn build-v2`

## Configuration

Politeiagui allow customization of settings and features toggling from enviroment variables. 
To make this process easier we use [dotenv](https://github.com/motdotla/dotenv). 

Specify your config options by creating a `.env` file in the root folder of the project. All 
variables must be preceded by "REACT_APP" as follow:

**/.env:**

```dosini
REACT_APP_TITLE="Politeia"
REACT_APP_STAGING=false
```

It is also possible to specify a preset to be used:

**/.env:**

```dosini
REACT_APP_PRESET="POLITEIA"
```

If the `REACT_APP_PRESET` is specified, all other specified options in the env
file will be ignored.

The full table of options is presented below:

| Option                 | POLITEIA (default)                                         | CMS                     | Description                                                                                                |
|------------------------|------------------------------------------------------------|-------------------------|------------------------------------------------------------------------------------------------------------|
| TITLE                  | "Politeia"                                                 | "Contractor Management" | The title to be used for the website                                                                       |
| RECORD_TYPE            | "proposal"                                                 | "invoice"               | The main record type name                                                                                  |
| ENABLE_ADMIN_INVITE    | false                                                      | true                    | To enable or not the UI elements required for admin invite                                                 |
| ENABLE_COMMENT_VOTE    | true                                                       | false                   | To enable or not the vote on comments                                                                      |
| TESTNET_GIT_REPOSITORY | "https://github.com/decred-proposals/testnet3/tree/master" | ""                      | The testnet git repository where the public records are stored                                             |
| MAINNET_GIT_REPOSITORY | "https://github.com/decred-proposals/mainnet/tree/master"  | ""                      | The mainnet git repository where the public records are stored                                             |
| PAYWALL_CONTENT        | "paywall-politeia"                                         | ""                       | Indicate what is the name of the markdown file under `src/contents` to be used for the paywall copy        |
| PRIVACY_POLICY_CONTENT | "privacy-policy"                                           | "privacy-policy-cms"    | Indicate what is the name of the markdown file under `src/contents` to be used for the privacy policy copy |

**Important:** Currently it's only possible to use the CMS or the POLITEIA presets fully. If you want to mix the options from one preset with another, you'll need to modify the code and the API accordingly.

## Testing 

Politeiagui has unit tests for its core logic. To run all unit tests run the command:

    yarn test


Test coverage is currently provided for (`actions/*`), (`lib/*, reducers/*`) and (`selectors/*`).


Relevant libraries/modules used for testing are:

 - [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) - Javascript testing
 - [fetch-mock](https://www.wheresrhys.co.uk/fetch-mock/) - Mock http requests
 - [redux-mock-store](https://github.com/dmitry-zaets/redux-mock-store) and [redux-actions-assertions](https://github.com/redux-things/redux-actions-assertions) for testing redux actions.


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
