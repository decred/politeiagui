#!/bin/bash

read -p 'HostName (should resolve from inside docker): ' HostName
echo 'proxy_cache_path  /var/cache/nginx  levels=1:2    keys_zone=STATIC:10m
    inactive=10m  max_size=1g;


server {
	set $host_name '$HostName';
	listen 80;
    server_name localhost;
    server_tokens off;
	include "conf.d/headers.conf";
	proxy_set_header       Host $host;
	proxy_buffering        on;
	proxy_cache            STATIC;
	proxy_cache_valid      200  10m;
	proxy_cache_valid      400 1m;
	proxy_cache_use_stale  error timeout invalid_header updating
								http_500 http_502 http_503 http_504;
	set $pretoken "";
	set $posttoken "%3F";
	if ($is_args) {
		set $pretoken "%3F";
		set $posttoken "%26";
	}
	set $args "${pretoken}${args}${posttoken}nojavascript%3Dtrue"; 
	location ~* ^/user/(login|signup|request-reset-password|verify) {
		return 403;
	}
	location  = / {
		proxy_pass http://$host_name:6060/render/https://$host_name$uri$args;
	}
	location ~ ^/(proposals/|user/) {
		proxy_pass http://$host_name:6060/render/https://$host_name$uri$args;
	}

	location / {
        return 403;
    }
}' > Nginx/nginx.conf

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

docker run -v \$HOME/.nginx/longcache/cache:/var/cache/nginx -d --rm -p 9090:80 decred/rendertronnginx:latest

docker run -d --rm -p 6060:6060 decred/rendertronmain:latest
=====================================
"