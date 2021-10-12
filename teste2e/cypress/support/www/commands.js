import "@testing-library/cypress/add-commands";
import { apiReply, policyReply } from "./api";
import { createMiddleware } from "../core/commands";

Cypress.Commands.add(
  "wwwMiddleware",
  createMiddleware({
    packageName: "www",
    repliers: {
      api: apiReply,
      policy: policyReply
    },
    baseUrl: "/"
  })
);
