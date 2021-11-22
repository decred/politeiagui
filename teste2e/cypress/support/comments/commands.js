import "@testing-library/cypress/add-commands";
import { createMiddleware } from "../core/commands";
import { repliers, API_BASE_URL } from "./api";

Cypress.Commands.add(
  "commentsMiddleware",
  createMiddleware({
    packageName: "comments",
    repliers,
    baseUrl: API_BASE_URL
  })
);

Cypress.Commands.add("useCommentsApi", (config = {}) => {
  cy.commentsMiddleware("count", config.count);
  cy.commentsMiddleware("policy");
  cy.commentsMiddleware("comments");
  cy.commentsMiddleware("votes");
});
