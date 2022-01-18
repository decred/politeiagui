import { buildComment } from "../../support/generate";
import {
  makeProposal,
  PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED,
  generateTokenPair
} from "../../utils";
import path from "path";
import {
  USER_TYPE_UNPAID,
  USER_TYPE_USER,
  userByType
} from "../../support/users/generate";

beforeEach(function mockApiCalls() {
  // currently mocking pi and ticketvote summaries calls with any status, since
  // they aren't used for assertions.
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
  cy.useCommentsApi();
  cy.generalMiddleware("users", { amount: 1 }, {}, ["publickey"]);
  cy.server();
});

describe("User comments", () => {
  it("Shouldn't allow submitting new comments if paywall not paid", () => {
    const { token, shortToken } = generateTokenPair();
    const { files } = makeProposal({});
    cy.userEnvironment(USER_TYPE_UNPAID);
    cy.recordsMiddleware("details", {
      status: 2,
      state: 2,
      files,
      token
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
    });
    cy.visit(`record/${shortToken}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");

    cy.findByRole("button", { name: /add comment/i }).should("be.disabled");
    cy.findByText(
      /you won't be able to submit comments or proposals before paying the paywall/i
    ).should("be.visible");
  });
  it("Should allow user who paid the paywall to add new comments & vote or reply on others' comments", () => {
    const user = userByType(USER_TYPE_USER);
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    const count = 4;
    cy.commentsMiddleware("count", { count });
    cy.commentsMiddleware("comments", { count });
    cy.commentsMiddleware("new", { commentid: count + 1, user });
    const { token, shortToken } = generateTokenPair();
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", {
      status: 2,
      state: 2,
      files,
      token
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
    });
    cy.visit(`record/${shortToken}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.wait("@comments.comments");
    cy.findAllByTestId("like-btn").first().click();
    cy.wait("@comments.vote");
    cy.findAllByTestId("like-btn").first().parent().should("have.text", "1");
    const { text } = buildComment();
    cy.findByTestId(/text-area/i).type(text);
    cy.findByText(/add comment/i).click();
    cy.wait("@comments.new");
    cy.get("#commentArea").contains(text).should("be.visible");
  });
  it("Should allow user who paid the paywall to reply on others' comments", () => {
    const user = userByType(USER_TYPE_USER);
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    const count = 4;
    cy.commentsMiddleware("count", { count });
    cy.commentsMiddleware("comments", { count });
    cy.commentsMiddleware("new", { commentid: count + 1, user });
    const { token, shortToken } = generateTokenPair();
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", {
      status: 2,
      state: 2,
      files,
      token
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
    });
    cy.visit(`record/${shortToken}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.wait("@comments.comments");
    const { text } = buildComment();
    cy.findAllByText(/reply/i).first().click();
    cy.findAllByTestId(/text-area/i)
      .eq(1)
      .type(text);
    cy.findAllByText(/add comment/i)
      .eq(1)
      .click();
    cy.wait("@comments.new");
    cy.get("#commentArea").contains(text).should("be.visible");
  });
});

describe("Comments downloads", () => {
  const { token, shortToken } = generateTokenPair();
  const user = userByType(USER_TYPE_USER);
  beforeEach(() => {
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    const count = 4;
    cy.commentsMiddleware("count", { count });
    cy.commentsMiddleware("comments", { count });
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", {
      status: 2,
      state: 2,
      files,
      token
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
    });
  });
  it("should publicly allow users to download comments bundle", () => {
    cy.visit(`/record/${shortToken}`);
    cy.wait("@records.details");
    cy.wait("@comments.comments");
    cy.wait("@comments.votes");
    cy.findByTestId("record-links").click();
    cy.wait(1000);
    cy.findByText(/comments bundle/i).click();
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.readFile(
      path.join(downloadsFolder, `${shortToken}-comments.json`)
    ).should("exist");
  });
  it("should publicly allow users to download comments timestamps", () => {
    cy.visit(`/record/${shortToken}`);
    cy.wait("@records.details");
    cy.wait("@comments.comments");
    cy.wait("@comments.votes");
    cy.findByTestId("record-links").click();
    cy.wait(1000);
    cy.findByText(/comments timestamps/i).click();
    cy.wait("@comments.timestamps");
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.readFile(
      path.join(downloadsFolder, `${shortToken}-comments-timestamps.json`)
    ).should("exist");
  });
});
describe("Comments error handling", () => {
  const { token, shortToken } = generateTokenPair();
  const user = userByType(USER_TYPE_USER);
  const count = 4;
  beforeEach(() => {
    cy.userEnvironment(USER_TYPE_USER, { verifyIdentity: true, user });
    cy.commentsMiddleware("count", { count });
    cy.commentsMiddleware("comments", { count });
    const { files } = makeProposal({});
    cy.recordsMiddleware("details", {
      status: 2,
      state: 2,
      files,
      token
    });
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { unauthorized: 1 }
    });
    cy.piMiddleware("summaries", {
      amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
    });
  });
  it("should display login modal when commenting with an expired user session", () => {
    cy.middleware("comments.new", { errorCode: 403 });
    cy.visit(`/record/${shortToken}`);
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.wait("@comments.comments");
    cy.findByTestId(/text-area/i).type("new comment");
    cy.findByTestId(/comment-submit-button/i).click();
    cy.wait("@comments.new");
    cy.findByTestId("modal-login").should("exist");
  });
});
