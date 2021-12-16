import { buildProposal } from "../../support/generate";
import { shortRecordToken, PROPOSAL_VOTING_AUTHORIZED } from "../../utils";
import {
  User,
  USER_TYPE_ADMIN,
  userByType
} from "../../support/users/generate";
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
  it("should be editable a public proposal as a proposal owner", () => {
    cy.server();
    const user = userByType(USER_TYPE_ADMIN);
    cy.log(user, user instanceof User);
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", { status: 1, state: 1, username: user });
    cy.recordsMiddleware("edit", { status: 1, state: 1, username: user });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.intercept("/api/records/v1/details").as("details");
    cy.intercept("/api/pi/v1/summaries").as("summaries");
    const token = faker.git.shortSha().slice(0, 7);
    const { description: newDescription } = buildProposal();
    cy.visit(`record/${token}`);
    cy.wait("@details");
    cy.wait("@summaries");
    cy.wait(2000);
    cy.findByTestId(/record-edit-button/i).click();
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
    cy.findByTestId("text-area").type(newDescription);
    cy.route("POST", "/api/records/v1/edit").as("editProposal");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@editProposal", { timeout: 10000 })
      .its("status")
      .should("eq", 200);
  });

  it("shouldn't be editable a proposal if not be the owner", () => {
    cy.server();
    cy.userEnvironment(USER_TYPE_ADMIN);
    cy.recordsMiddleware("details", { status: 1, state: 1 });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.intercept("/api/records/v1/details").as("details");
    cy.intercept("/api/pi/v1/summaries").as("summaries");
    const token = faker.git.shortSha().slice(0, 7);
    cy.visit(`record/${token}`);
    cy.wait("@details");
    cy.wait("@summaries");
    cy.findByTestId(/record-edit-button/i).should("not.exist");
  });

  it("shouldn't be editable an authorized voting proposal", () => {
    cy.server();
    const user = userByType(USER_TYPE_ADMIN);
    cy.log(user, user instanceof User);
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", {
      status: PROPOSAL_VOTING_AUTHORIZED,
      state: 1,
      username: user
    });
    cy.recordsMiddleware("edit", {
      status: PROPOSAL_VOTING_AUTHORIZED,
      state: 1,
      username: user
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.intercept("/api/records/v1/details").as("details");
    cy.intercept("/api/pi/v1/summaries").as("summaries");
    const token = faker.git.shortSha().slice(0, 7);
    const { description: newDescription } = buildProposal();
    cy.visit(`record/${token}`);
    cy.wait("@details");
    cy.wait("@summaries");
    cy.findByTestId(/record-edit-button/i).should("not.exist");
  });

  it("shouldn't be editable without making any changes", () => {
    cy.server();
    const user = userByType(USER_TYPE_ADMIN);
    cy.log(user, user instanceof User);
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
    cy.recordsMiddleware("details", { status: 1, state: 1, username: user });
    cy.recordsMiddleware("edit", { status: 1, state: 1, username: user });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.intercept("/api/records/v1/details").as("details");
    cy.intercept("/api/pi/v1/summaries").as("summaries");
    const token = faker.git.shortSha().slice(0, 7);
    cy.visit(`record/${token}`);
    cy.wait("@details");
    cy.wait("@summaries");
    cy.wait(2000);
    cy.findByTestId(/record-edit-button/i).click();
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});
