#!/bin/bash -e

# Setup
rm -rf docker-build
mkdir docker-build

# Build politeiagui
docker build . \
	-f ./Dockerfile-build \
	-t decred/politeiagui-build

docker run --rm \
	-v $(pwd)/docker-build:/root/build \
	decred/politeiagui-build:latest

# Build docker image to serve politeiagui
docker build . \
	-f ./Dockerfile-serve \
	-t decred/politeiagui-serve

echo ""
echo "==================="
echo "  Build complete"
echo "==================="
echo ""
echo "You can now run politeiagui with the following command:"
echo "    docker run -d --rm -p <local port>:80 decred/politeiagui-serve:latest"
echo ""

# Cleanup
# TODO: reenable cleanup once it's figured out how to bypass 
# the permission restrictions
rm -rf docker-build
