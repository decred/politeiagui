import "@testing-library/cypress/add-commands";
import { createMiddleware } from "../core/commands";
import { repliers, API_BASE_URL } from "./api";

Cypress.Commands.add(
  "ticketvoteMiddleware",
  createMiddleware({
    packageName: "ticketvote",
    repliers,
    baseUrl: API_BASE_URL
  })
);

Cypress.Commands.add("useTicketvoteApi", (config = {}) => {
  cy.ticketvoteMiddleware("summaries", config.summaries);
  cy.ticketvoteMiddleware("inventory", config.inventory);
  cy.ticketvoteMiddleware("policy", config.policy);
  cy.ticketvoteMiddleware("timestamps", config.timestamps);
  cy.ticketvoteMiddleware("results", config.results);
  cy.ticketvoteMiddleware("details", config.details);
});
