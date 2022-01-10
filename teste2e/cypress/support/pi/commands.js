import "@testing-library/cypress/add-commands";
import { createMiddleware } from "../core/commands";
import { repliers, API_BASE_URL } from "./api";
import { makeProposal } from "../../utils";
import faker from "faker";

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

Cypress.Commands.add("useProposalDetailSuite", ({ token, status, user }) => {
  const { files } = makeProposal({});
  cy.recordsMiddleware("details", {
    status: 2,
    state: 2,
    files,
    token
  });
  cy.ticketvoteMiddleware("summaries", {
    amountByStatus: { [status]: 1 }
  });
  cy.piMiddleware("summaries", { amountByStatus: { [status]: 1 } });
  cy.middleware("users.users", {
    body: {
      totalmatches: 1,
      totalusers: 10,
      users: [
        {
          id: faker.random.uuid(),
          username: faker.internet.userName(),
          email: faker.internet.email()
        }
      ]
    }
  });
  cy.recordsMiddleware("setstatus", {
    user
  });
});
