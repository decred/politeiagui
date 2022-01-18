import "@testing-library/cypress/add-commands";
import { createMiddleware } from "../core/commands";
import { repliers, API_GENERAL_BASE_URL } from "./api";

Cypress.Commands.add(
  "generalMiddleware",
  createMiddleware({
    packageName: "general",
    repliers,
    baseUrl: API_GENERAL_BASE_URL
  })
);

Cypress.Commands.add("useGeneralApi", (config = {}) => {
  cy.commentsMiddleware("users", config.users);
});
