FROM node:12.14 as build

LABEL description="politeiarendertron build"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

# Install rendertron
RUN git clone https://github.com/GoogleChrome/rendertron.git --branch 3.0.0 --single-branch\
    && cd rendertron \
    && npm install \
    && npm run build \
    # Patching Puppeteer launch arguments \
    && DEFAULT_ARGS="\['--no-sandbox'\]" \
    && ARGS="\['--no-sandbox', '--disable-dev-shm-usage'\]" \
    # To disable HTTPS check  replace previous line with  && ARGS="\['--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors'\], ignoreHTTPSErrors: true" \
    && sed -i "s/$DEFAULT_ARGS/$ARGS/g" build/rendertron.js

FROM node:14.5.0-stretch-slim

COPY --from=build /rendertron /rendertron

# Install chrome 
RUN apt-get update -qq && apt-get install -qq --no-install-recommends \
    wget \
    gnupg2 \
    ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update -qq && apt-get install -qq --no-install-recommends \
    google-chrome-stable \
    && apt-get remove -y \
    wget \
    gnupg2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* 

#Port that rendertron will run in locally
ENV PORT=6060

WORKDIR /rendertron/bin

CMD ["rendertron"]