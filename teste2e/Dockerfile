FROM cypress/base:12.14.1
WORKDIR /app

# dependencies will be installed only if the package files change
COPY package.json .
COPY package-lock.json .
COPY wait-for-it.sh .

# by setting CI environment variable we switch the Cypress install messages
# to small "started / finished" and avoid 1000s of lines of progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1
RUN npm ci
# verify that Cypress has been installed correctly.
# running this command separately from "cypress run" will also cache its result
# to avoid verifying again when running the tests
