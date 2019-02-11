# Build image
FROM node:10.15.1

LABEL description="politeiagui build"
LABEL version="1.0"
LABEL maintainer "holdstockjamie@gmail.com"

USER root
WORKDIR /root

COPY ./ /root/

RUN yarn install

RUN yarn build

# Serve image (stable nginx version)
FROM nginx:1.14.2 

LABEL description="politeiagui serve"
LABEL version="1.0"
LABEL maintainer "holdstockjamie@gmail.com"

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /root/build /usr/share/nginx/html
