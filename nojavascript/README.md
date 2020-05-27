# How to setup nojavascript politeia website

## Please note this requires some sysadmin work and is usually not required for development! 

### Consider the site `https://example.com`

### Nginx or another similar server should redirect all traffic from `https://example.com/nojavascipt/` to the port exposed by the docker image "decred/rendertronnginx" 

Rule:

`
location /nojavascript/ {
    rewrite ^/nojavascript/(.*)$ /$1 break;
    proxy_pass http://127.0.0.1:9090;
    }
`



### Build the docker images using the command `./build.sh`. 


#### It is very important that the host is accessible from inside the docker images. This is usually example.com. If this is not possible start the docker images with the ["--add-host"](https://docs.docker.com/engine/reference/run/#managing-etchosts) command. You might also need to setup a docker [internal network](https://docs.docker.com/engine/reference/commandline/network_create/). When properly setup you should be able to `curl 'https://example.com'` from inside docker and it should return the contents of `https://example.com`.

## Start rendertronmain 

This is the server that renders the contents of the website and gives a pure HTML output. This should never be exposed to the internet.

Docker command:

`docker run -d --rm -p 6060:6060 decred/rendertronmain:latest`

## Start rentertronnginx

If you use the below command the location `$HOME/.nginx/longcache/cache `is used to store the cache.  Because the contents of the politeia site keeps changing cache only lasts 10 minutes. This can be edited in the file `/Nginx/nginx.conf.template`. Delete the contents of this folder if you are having cache issues.

Docker command:

`docker run  -e PIHOSTNAME={HOSTNAMEHERE} -v $HOME/.nginx/longcache/cache:/var/cache/nginx -d --rm -p 9090:80 decred/rendertronnginx:latest`

## Final checks. 


Disable javascript on the browser and visit `https://example.com/nojavascript/` it should cleanly load the contents and allow you to visit the public proposals and user pages.
