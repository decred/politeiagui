import "@testing-library/cypress/add-commands";
import { createMiddleware } from "../core/commands";
import { repliers, API_BASE_URL } from "./api";

Cypress.Commands.add(
  "piMiddleware",
  createMiddleware({
    packageName: "pi",
    repliers,
    baseUrl: API_BASE_URL
  })
);

Cypress.Commands.add("usePiApi", (config = {}) => {
  cy.piMiddleware("summaries", config.summaries);
  cy.piMiddleware("policy");
});
