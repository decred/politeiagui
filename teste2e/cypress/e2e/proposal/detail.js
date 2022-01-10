import {
  shortRecordToken,
  PROPOSAL_SUMMARY_STATUS_UNVETTED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_CENSORED,
  PROPOSAL_SUMMARY_STATUS_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
  PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED,
  PROPOSAL_SUMMARY_STATUS_VOTE_STARTED,
  PROPOSAL_SUMMARY_STATUS_REJECTED,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_COMPLETED,
  PROPOSAL_SUMMARY_STATUS_CLOSED,
  PROPOSAL_VOTING_APPROVED,
  makeProposal,
  fullRecordToken,
  generateTokenPair
} from "../../utils";
import path from "path";
import faker from "faker";
import {
  USER_TYPE_ADMIN,
  USER_TYPE_NO_LOGIN,
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
  cy.intercept("POST", "/api/v1/logout", {
    statusCode: 200,
    body: {}
  }).as("logout");
});

describe("Proposal details", () => {
  beforeEach(() => {
    cy.server();
    cy.userEnvironment(USER_TYPE_NO_LOGIN);
  });
  describe("regular proposal renders correctly", () => {
    it("should render a propsoal with a short token", () => {
      const fullToken = fullRecordToken();
      const shortToken = shortRecordToken(fullToken);
      const { files } = makeProposal({});
      cy.recordsMiddleware("details", {
        status: 2,
        state: 2,
        files,
        fullToken
      });
      cy.recordsMiddleware("edit", { status: 1, state: 1 });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { unauthorized: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.get("[data-testid='record-token'] > span")
        .first()
        .should("be.visible")
        .and("have.text", fullToken);
    });

    it("should render a proposal with a full token", () => {
      const fullToken = fullRecordToken();
      const { files } = makeProposal({});
      cy.recordsMiddleware("details", {
        status: 2,
        state: 2,
        files,
        fullToken
      });
      cy.recordsMiddleware("edit", { status: 1, state: 1 });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { unauthorized: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
      cy.visit(`record/${fullToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.get("[data-testid='record-token'] > span")
        .first()
        .should("be.visible")
        .and("have.text", fullToken);
    });

    afterEach(() => {
      // assert header existence
      cy.get("[data-testid='record-header']")
        .children()
        .should("be.visible")
        .and("have.length", 2);
      // assert description existence
      cy.get("[data-testid='markdown-wrapper']").should("exist");
      // assert metadata existence
      cy.get("[data-testid='record-metadata']")
        .should("include.text", "Domain")
        .and("include.text", "Amount")
        .and("include.text", "Start Date")
        .and("include.text", "End Date");
    });
  });

  describe("proposal downloads", () => {
    it("should publicly allow to download proposal bundle", () => {
      const fullToken = fullRecordToken();
      const shortToken = shortRecordToken(fullToken);
      const version = 3;
      cy.visit(`/record/${fullToken}`);
      const { files } = makeProposal({});
      cy.recordsMiddleware("details", {
        status: 2,
        state: 2,
        files,
        fullToken,
        version
      });
      cy.recordsMiddleware("edit", { status: 1, state: 1 });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { unauthorized: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
      cy.visit(`record/${fullToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.wait("@ticketvote.summaries");
      // wait 2 seconds for the slow device
      cy.wait(2000);
      cy.findByText(/Available Downloads/i).click();
      cy.findByText(/proposal bundle/i).click();
      const downloadsFolder = Cypress.config("downloadsFolder");
      cy.readFile(
        path.join(downloadsFolder, `${shortToken}-v${version}.json`)
      ).should("exist");
    });
    it("should publicly allow to download proposal timestamps", () => {
      const fullToken = fullRecordToken();
      const shortToken = shortRecordToken(fullToken);
      const version = 3;
      cy.visit(`/record/${fullToken}`);
      const { files } = makeProposal({});
      cy.recordsMiddleware("details", {
        status: 2,
        state: 2,
        files,
        fullToken,
        version
      });
      cy.recordsMiddleware("edit", { status: 1, state: 1 });
      cy.recordsMiddleware("timestamps", {});
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { unauthorized: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
      cy.visit(`record/${fullToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.wait("@ticketvote.summaries");
      // wait 2 seconds for the slow device
      cy.wait(2000);
      cy.findByText(/Available Downloads/i).click();
      cy.findByText(/proposal timestamps/i).click();
      const downloadsFolder = Cypress.config("downloadsFolder");
      cy.readFile(
        path.join(downloadsFolder, `${shortToken}-v${version}-timestamps.json`)
      ).should("exist");
    });
  });

  describe("invalid proposal rendering", () => {
    it("should dislpay not found message for nonexistent proposals", () => {
      cy.intercept("POST", "/api/records/v1/details", {
        statusCode: 400,
        body: {
          errorcode: 13
        }
      }).as("details");
      cy.visit("/record/invalidtoken");
      cy.wait("@details");
      cy.contains("Error: The record was not found").should("be.visible");
    });
  });

  describe("user proposals actions", () => {
    const user = userByType(USER_TYPE_ADMIN);
    const fullToken = fullRecordToken();
    const shortToken = shortRecordToken(fullToken);
    beforeEach(() => {
      cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
      const { files } = makeProposal({});
      cy.recordsMiddleware("details", {
        status: 1,
        state: 1,
        files,
        fullToken,
        user
      });
      cy.recordsMiddleware("edit", { status: 1, state: 1 });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { unauthorized: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
    });
    it("should be able to logout from unvetted proposal details page", () => {
      cy.middleware("comments.comments", 10, 1);
      cy.visit(`/record/${shortToken}`);
      cy.wait("@records.details");
      cy.findByTestId("record-header").should("be.visible");
      cy.findByTestId("proposal-body").should("exist");
      cy.userLogout(user.username);
      cy.wait(2000);
      // assert that proposal files were removed from store
      cy.findByTestId("record-header").should("be.visible");
      cy.findByTestId("proposal-body").should("not.exist");
      cy.get("#commentArea").should("not.exist");
    });
    it("should render unvetted proposal details after admin/author login", () => {
      cy.visit(`/record/${shortToken}`);
      cy.findByTestId("proposal-body").should("exist");
      cy.get("#commentArea").should("exist");
    });
  });

  describe("proposal status tags", () => {
    it("should display unvetted status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // unvetted.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNVETTED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/unvetted/i).should("be.visible");
    });
    it("should display unvetted censored status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // unvetted censored.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/censored/i).should("be.visible");
    });
    it("should display unvetted abandoned status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // unvetted abandoned.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/Abandoned/).should("be.visible");
    });
    it("should display censored status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // censored.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_CENSORED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/censored/i).should("be.visible");
    });
    it("should display abandoned status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // abandoned.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_ABANDONED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/Abandoned/).should("be.visible");
    });
    it("should display under review status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // under review.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/waiting for author to authorize voting/i).should(
        "be.visible"
      );
    });
    it("should display vote authorized status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // vote authorized.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/waiting for admin to start voting/i).should("be.visible");
    });
    it("should display vote authorized status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // vote started.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_VOTE_STARTED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/voting/i).should("be.visible");
    });
    it("should display rejected status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // rejected.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_REJECTED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/rejected/i).should("be.visible");
    });
    it("should display active status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // active.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_ACTIVE
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/active/i).should("be.visible");
    });
    it("should display closed status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // closed.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_CLOSED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/closed/i).should("be.visible");
    });
    it("should display completed status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // completed.
      const { token, shortToken } = generateTokenPair();
      cy.useProposalDetailSuite({
        token,
        status: PROPOSAL_SUMMARY_STATUS_COMPLETED
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/completed/i).should("be.visible");
    });
  });

  describe("proposal status action", () => {
    // paid admin user with proposal credits
    const user = userByType(USER_TYPE_ADMIN);
    beforeEach(() => {
      cy.server();
      cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
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
    });
    it("should able to report a proposal", () => {
      const { token, shortToken } = generateTokenPair();
      const { files } = makeProposal({});
      const status = 2;
      const state = 2;
      cy.recordsMiddleware("details", {
        status,
        state,
        files,
        token
      });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED]: 1 }
      });
      cy.recordsMiddleware("setstatus", {
        user,
        oldStatus: status,
        files: [],
        state
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      // Manually report proposal
      cy.findByText(/report/i).click();
      cy.findByLabelText(/censor reason/i).type("censor!");
      cy.findByText(/confirm/i).click();
      cy.wait("@records.setstatus");
      cy.findByText(/The proposal has been successfully censored/i).should(
        "be.visible"
      );
    });

    it("should able to abandon a proposal", () => {
      const { token, shortToken } = generateTokenPair();
      const { files } = makeProposal({});
      const status = 4;
      const state = 2;
      cy.recordsMiddleware("details", {
        status: 2,
        state,
        files,
        token
      });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { ["unauthorized"]: 1 }
      });
      cy.piMiddleware("summaries", { amountByStatus: { ["under-review"]: 1 } });
      cy.recordsMiddleware("setstatus", {
        user,
        oldStatus: status,
        files: [],
        state
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      // Manually abandon
      cy.findByText(/abandon/i).click();
      cy.findByLabelText(/abandon reason/i).type("abandon!");
      cy.findByText(/confirm/i).click();
      cy.wait("@records.setstatus");
      cy.findByText(/The proposal has been successfully abandoned/i).should(
        "be.visible"
      );
    });
  });

  describe("proposal status metadata", () => {
    // paid admin user with proposal credits
    const user = userByType(USER_TYPE_ADMIN);
    beforeEach(() => {
      cy.server();
      cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true, user });
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
    });
    it("should display proposal status metadata on censored proposal", () => {
      const { token, shortToken } = generateTokenPair();
      cy.recordsMiddleware("details", {
        status: 3,
        state: 2,
        files: [],
        token,
        oldStatus: 2,
        reason: "censored!"
      });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { ["ineligible"]: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { ["censored"]: 1 }
      });
      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.findByText(/This proposal has been censored by/i).should("be.visible");
    });

    it("should display proposal status metadata on abandoned proposal", () => {
      const { token, shortToken } = generateTokenPair();
      const { files } = makeProposal({});
      cy.recordsMiddleware("details", {
        status: 4,
        state: 2,
        files,
        token,
        oldStatus: 2,
        reason: "abandoned!"
      });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { ["ineligible"]: 1 }
      });
      cy.piMiddleware("summaries", { amountByStatus: { ["abandoned"]: 1 } });

      cy.visit(`record/${shortToken}`);
      cy.wait("@records.details");
      cy.wait("@pi.summaries");
      cy.wait("@ticketvote.summaries");
      cy.findByText(/This proposal has been abandoned by/i).should("be.visible");
    });

    it("should display proposal status metadata on closed proposal", () => {
      const { token, shortToken } = generateTokenPair();
      const { files } = makeProposal({});
      const status = PROPOSAL_VOTING_APPROVED;
      const state = 2;
      cy.recordsMiddleware("details", {
        status: 2,
        state: state,
        files,
        token
      });
      cy.ticketvoteMiddleware("summaries", {
        amountByStatus: { ["approved"]: 1 }
      });
      cy.piMiddleware("summaries", {
        amountByStatus: { [PROPOSAL_SUMMARY_STATUS_CLOSED]: 1 }
      });
      cy.recordsMiddleware("setstatus", {
        user,
        oldStatus: status,
        files: [],
        state
      });
      // Mock billing status changes request.
      cy.piMiddleware("billingstatuschanges", { amountByStatus: { 2: 1 } });
      cy.visit(`record/${shortToken}`);
      cy.wait("@pi.summaries");
      cy.wait("@pi.billingstatuschanges");
      cy.wait("@users.users");
      cy.findByText(/This proposal has been closed by/i).should("be.visible");
    });
  });
});
