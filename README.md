# Politeia GUI

## Development

### With mock APIs

    yarn && yarn uidev

### Against politeiawww

    yarn && yarn start

## Production

    yarn && yarn build
    ls build

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
