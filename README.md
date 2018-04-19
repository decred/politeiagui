# Politeia GUI

## Development

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
