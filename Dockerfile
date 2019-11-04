# Build image
FROM node:12.13

LABEL description="politeiagui build"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

USER root
WORKDIR /root

COPY ./ /root/

RUN yarn install --network-concurrency 1

RUN INLINE_RUNTIME_CHUNK=false yarn build

# Serve image (stable nginx version)
FROM nginx:1.16

LABEL description="politeiagui serve"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /root/build /usr/share/nginx/html
