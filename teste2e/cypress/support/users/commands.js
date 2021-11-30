import "@testing-library/cypress/add-commands";
import "../www/commands";
import { API_BASE_URL, repliers } from "./api";
import { createMiddleware } from "../core/commands";

Cypress.Commands.add(
  "userMiddleware",
  createMiddleware({ packageName: "user", repliers, baseUrl: API_BASE_URL })
);

Cypress.Commands.add("userEnvironment", (userType, { verifyIdentity } = {}) => {
  cy.wwwMiddleware(
    "api",
    { isActive: userType !== "noLogin" },
    { headers: { "x-csrf-token": "abcdefghijklmnopqrstuvwxyz" } }
  );
  cy.userMiddleware("me", { userType, verifyIdentity });
  cy.userMiddleware("payments/registration", {
    haspaid: userType !== "unpaid"
  });
  cy.userMiddleware("payments/paywall", { haspaid: userType !== "unpaid" });
  cy.userMiddleware("payments/credits", {
    spent: 0,
    credits: userType === "noCredits" ? 0 : 100
  });
});
