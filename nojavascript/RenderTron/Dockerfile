FROM node:12.14

LABEL description="politeiarendertron build"
LABEL version="1.0"
LABEL maintainer "jholdstock@decred.org"

#Install chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

#Port that rendertron will run in locally
ENV PORT=6060

# Install rendertron
RUN git clone https://github.com/GoogleChrome/rendertron.git \
    && cd rendertron \
    && npm install \
    && npm run build \
    # Patching Puppeteer launch arguments \
    && DEFAULT_ARGS="\['--no-sandbox'\]" \
    && ARGS="\['--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors'\], ignoreHTTPSErrors: true" \
    && sed -i "s/$DEFAULT_ARGS/$ARGS/g" build/rendertron.js
#Make user
RUN groupadd -r rendertronuser && useradd -r -g rendertronuser -G audio,video rendertronuser \
    && mkdir -p /home/rendertronuser && chown -R rendertronuser:rendertronuser /home/rendertronuser \
    && chown -R rendertronuser:rendertronuser /rendertron

#Run as non root
USER rendertronuser

WORKDIR /rendertron

CMD ["npm","run","start"]