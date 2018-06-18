# Politeia GUI

## Development

### Requirements
- [node](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/en/)

### With mock APIs

    yarn && yarn uidev

### Against politeiawww

    yarn && yarn start

## Production

    yarn && yarn build
    ls build

## package.json

    The package.json file has the field "network" (testnet or mainnet),
    which we need in order to get the last block height.

    This way it is possible to determine when a vote has finished or not.
---

## Testing 

This code has currently unit tests for the core logic. Currently covering lib files (`/src/lib/*`) and actions files (`/src/actions/*`).
Relevant libraries/modules used for testing are:
 - [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) - Javascript testing
 - [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/api) - Mock http requests
 - [redux-mock-store](https://github.com/dmitry-zaets/redux-mock-store) and [redux-actions-assertions](https://github.com/redux-things/redux-actions-assertions) for testing redux actions.

There is more testing to be done, you can check it on this opened issue: https://github.com/decred/politeiagui/issues/376


## Docker

`politeia` can be hosted in a docker container. To build the site and the docker container:

```bash
$ ./build_docker.sh
```

The container can then be run with

```bash
$ docker run -d --rm -p <local port>:80 decred/politeiagui-serve:latest
```

---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
