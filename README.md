# Politeia GUI

Politeiagui is the web frontent for [Politiea](https://github.com/decred/politeia), Decred's [proposal system](https://proposals.decred.org/). 


## Requirements

Politeiagui uses node.js and the yarn package manager. 

- [node](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/)



Politeiagui can be built and run as a standalone application that uses mock APIs to simulate communicaiton with the Politeia backend (useful if you're only doing UI changes). However, if you want run the the full Politeia application, you'll first need to build and run `politeiawww`, Politeia's webserver. Instructions for doing so can be found [here](https://github.com/decred/politeia)


## Development


1. Clone this repository

    `https://github.com/decred/politeiagui.git`
    

1. Build and run locally.

    **Mock APIs**

    To run politeiagui using mock APIs that do not communicate with `politeiawww` (useful for working on UI changes only), run the following command:
    
    `yarn && yarn uidev`
    
    **Against politeiawww**
    
    To run politeiagui against `politeiawww`, make sure `politeiawww` is running and use the following command:
    
    `yarn && yarn start`
    

## Production

To build politeiagui for production deployment, use the following commands:

    yarn && yarn build
    ls build

## Configuration


By default, politeiagui is configured to use Decred's testnet blockchain. To use the mainnet blockchain, change the "network" field in `package.json` to "mainnet". 

It is necessary for politeiagui to connect to the testnet or mainnet in order to get the last block height, and determine the status of votes. 

---

## Testing 

Politeiagui currently has unit tests for its core logic. Test coverage is provied for lib files (`/src/lib/*`) and actions files (`/src/actions/*`).

Relevant libraries/modules used for testing are:

 - [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) - Javascript testing
 - [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/api) - Mock http requests
 - [redux-mock-store](https://github.com/dmitry-zaets/redux-mock-store) and [redux-actions-assertions](https://github.com/redux-things/redux-actions-assertions) for testing redux actions.


## Docker

Politeiagui can be hosted in a docker container. To build the site and the docker container, run the following commands:

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
