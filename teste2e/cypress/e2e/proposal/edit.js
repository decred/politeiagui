import { buildProposal } from "../../support/generate";
import { PROPOSAL_VOTING_AUTHORIZED, makeProposal } from "../../utils";
import { USER_TYPE_ADMIN, userByType } from "../../support/users/generate";
import faker from "faker";

beforeEach(function mockApiCalls() {
  // currently mocking pi and ticketvote summaries calls with any status, since
  // they aren't used for assertions.
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
  cy.useCommentsApi();
});

describe("Proposal Edit", () => {
  it("should allow proposal owner to edit its own public proposal", () => {
    cy.server();
    const { files } = makeProposal({});
    const user = userByType(USER_TYPE_ADMIN);
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", {
      status: 1,
      state: 1,
      files,
      user
    });
    cy.recordsMiddleware("edit", { status: 1, state: 1, user });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    const token = faker.git.shortSha().slice(0, 7);
    cy.visit(`record/${token}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.findByTestId(/record-edit-button/i).click();
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
    const { description: newDescription } = buildProposal();
    cy.findByTestId("text-area").type(newDescription);
    cy.findByRole("button", { name: /submit/i }).should("not.be.disabled");
  });

  it("shouldn't allow editing if user is not the proposal owner", () => {
    cy.server();
    cy.userEnvironment(USER_TYPE_ADMIN);
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", { status: 1, state: 1, files });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    const token = faker.git.shortSha().slice(0, 7);
    cy.visit(`record/${token}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.findByTestId(/record-edit-button/i).should("not.exist");
  });

  it("shouldn't allow editing authorized voting proposals", () => {
    cy.server();
    const user = userByType(USER_TYPE_ADMIN);
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", {
      status: PROPOSAL_VOTING_AUTHORIZED,
      state: 1,
      files,
      user
    });
    cy.recordsMiddleware("edit", {
      status: PROPOSAL_VOTING_AUTHORIZED,
      state: 1,
      user
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    const token = faker.git.shortSha().slice(0, 7);
    cy.visit(`record/${token}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.findByTestId(/record-edit-button/i).should("not.exist");
  });

  it("shouldn't allow editing without making any changes", () => {
    cy.server();
    const user = userByType(USER_TYPE_ADMIN);
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", {
      status: 1,
      state: 1,
      files,
      user
    });
    cy.recordsMiddleware("edit", { status: 1, state: 1, user });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    const token = faker.git.shortSha().slice(0, 7);
    cy.visit(`record/${token}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.wait(2000);
    cy.findByTestId(/record-edit-button/i).click();
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});
