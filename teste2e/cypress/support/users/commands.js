import "@testing-library/cypress/add-commands";
import "../www/commands";
import {
  API_BASE_URL,
  repliers,
  usersRepliers
} from "./api";
import { createMiddleware } from "../core/commands";
import {
  USER_TYPE_UNPAID,
  USER_TYPE_NO_CREDITS,
  USER_TYPE_NO_LOGIN
} from "./generate";

Cypress.Commands.add(
  "userMiddleware",
  createMiddleware({ packageName: "user", repliers, baseUrl: API_BASE_URL })
);

Cypress.Commands.add(
  "usersMiddleware",
  createMiddleware({
    packageName: "users",
    repliers: usersRepliers,
    baseUrl: "/api/v1"
  })
);

Cypress.Commands.add(
  "userEnvironment",
  (userType, { verifyIdentity, user } = {}) => {
    cy.wwwMiddleware(
      "api",
      { isActive: userType !== USER_TYPE_NO_LOGIN },
      { headers: { "x-csrf-token": "abcdefghijklmnopqrstuvwxyz" } }
    );
    cy.userMiddleware("me", { userType, verifyIdentity, user });
    cy.userMiddleware("payments/registration", {
      haspaid: userType !== USER_TYPE_UNPAID
    });
    cy.userMiddleware("payments/paywall", {
      haspaid: userType !== USER_TYPE_UNPAID
    });
    cy.userMiddleware("payments/credits", {
      spent: 0,
      credits: userType === USER_TYPE_NO_CREDITS ? 0 : 100
    });
  }
);
