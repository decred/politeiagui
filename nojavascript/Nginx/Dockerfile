FROM nginx:1.16

LABEL description="rendertron nginx server"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./headers.conf /etc/nginx/conf.d/headers.conf
