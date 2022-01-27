import "@testing-library/cypress/add-commands";
import { repliers, errorReply, API_BASE_URL } from "./api";

/**
 * createMiddleware is a HoF that creates a custom middleware for some package.
 * It returns a request interceptor with an alias composed by
 * `"{packageName}.{endpoint}"`
 *
 * @param {Object} { packageName, repliers, baseUrl }
 * @returns Middleware aliased by `"{packageName}.{endpoint}"`
 */
export function createMiddleware({ packageName, repliers, baseUrl }) {
  return function middleware(
    endpoint,
    { error, delay, ...testParams } = {},
    responseParams = {},
    searchParams = []
  ) {
    // search is built from searchParams. Support for GET request.
    const search =
      searchParams.length > 0 ? `?${searchParams.join("=*&")}=*` : "";
    const path = endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
    return cy
      .intercept(`${path}${search}`, (req) => {
        const replyfn = repliers[endpoint];
        if (!replyfn)
          throw new Error(`no ${packageName} replier found for ${endpoint}`);
        const requestParams = req.body || {};
        if (error) {
          req.reply({
            delay,
            ...errorReply(error),
            ...responseParams
          });
        } else {
          req.reply({
            delay,
            body: replyfn({ testParams, requestParams }),
            ...responseParams
          });
        }
      })
      .as(`${packageName}.${endpoint}`);
  };
}

Cypress.Commands.add(
  "recordsMiddleware",
  createMiddleware({ packageName: "records", repliers, baseUrl: API_BASE_URL })
);

Cypress.Commands.add("useRecordsApi", (config = {}) => {
  cy.recordsMiddleware("edit", config.edit);
  cy.recordsMiddleware("records", config.records);
  cy.recordsMiddleware("inventory", config.inventory);
  cy.recordsMiddleware("policy", config.policy);
});
