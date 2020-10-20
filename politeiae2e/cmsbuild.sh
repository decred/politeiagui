#!/bin/bash
cd $(dirname $0)
echo ""
echo "====================================="
echo "  Making cert files                  "
echo "====================================="
echo ""
openssl req -new -newkey rsa:4096 -days 3650 -nodes -x509 \
    -subj "/C=--/ST=--/L=--/O=--/CN=--" \
    -keyout dockerfiles/nginx.key  -out dockerfiles/nginx.cert
echo ""
echo "====================================="
echo "  Building politeiae2ecms docker image  "
echo "====================================="
echo ""
docker build -t politeiae2ecms --file CmsDockerfile .
echo ""
echo "==================="
echo "  Build complete"
echo "==================="
echo ""
echo "You can now run politeiae2ecms with the following command:"
echo "    docker run -d --rm -p 8443:443 politeiae2ecms"
echo "    It can be accessed on https://localhost:8443" 
echo "" 