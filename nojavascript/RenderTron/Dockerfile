FROM node:12.14 as build

LABEL description="politeiarendertron build"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

# Install rendertron
RUN git clone https://github.com/GoogleChrome/rendertron.git --branch 3.0.0 --single-branch\
    && cd rendertron \
    # Uncomment below line to disable ssl check
    #&& sed -i "55s/.*/        puppeteerArgs: ['--no-sandbox','--ignore-certificate-errors']/" src/config.ts \
    && npm install \
    && npm run build


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