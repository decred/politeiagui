#!/bin/bash

echo "
=====================================
Building rendertronnginx docker image  
=====================================
"

docker build -t decred/rendertronnginx Nginx/

echo "
=====================================
Building rendertronmain docker image  
=====================================
"

docker build -t decred/rendertronmain RenderTron/

echo "
=====================================
Build complete the programs can be run using 

docker run -e PIHOSTNAME={HOSTNAMEHERE} -v \$HOME/.nginx/longcache/cache:/var/cache/nginx -d --rm -p 9090:80 decred/rendertronnginx:latest

docker run -d --rm -p 6060:6060 decred/rendertronmain:latest
=====================================
"