#!/bin/bash -e
# Requires docker 17.05 or higher

echo ""
echo "====================================="
echo "  Building politeiagui docker image  "
echo "====================================="
echo ""

docker build -t decred/politeiagui .

echo ""
echo "==================="
echo "  Build complete"
echo "==================="
echo ""
echo "You can now run politeiagui with the following command:"
echo "    docker run -d --rm -p <local port>:80 decred/politeiagui:latest"
echo ""
