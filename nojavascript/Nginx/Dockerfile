FROM nginx:1.16

LABEL description="rendertron nginx server"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

COPY ./headers.conf /etc/nginx/conf.d/headers.conf
COPY ./nginx.conf.template /etc/nginx/conf.d/default.conf.template
CMD /bin/bash -c "envsubst '\$PIHOSTNAME' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"