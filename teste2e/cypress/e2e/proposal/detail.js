import {
  getFirstShortProposalToken,
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
  PROPOSAL_SUMMARY_STATUS_CLOSED
} from "../../utils";
import { buildProposal } from "../../support/generate";
import path from "path";

describe("Proposal details", () => {
  let token, shortToken;
  beforeEach(() => {
    cy.intercept("/api/records/v1/records").as("records");
    cy.intercept("/api/records/v1/details").as("details");
  });
  describe("regular proposal renders correctly", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@records").then(({ response: { body } }) => {
        const { records } = body;
        shortToken = getFirstShortProposalToken(records);
        token = records[shortToken].censorshiprecord.token;
        expect(shortToken, "You should have at least one record Under Review.")
          .to.exist;
      });
    });
    it("should render a propsoal with a short token", () => {
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
    });
    it("should render a proposal with a full token", () => {
      cy.visit(`/record/${token}`);
      cy.wait("@details");
    });
    afterEach(() => {
      // assert token clipboard existence
      cy.get("[data-testid='record-token'] > span")
        .first()
        .should("be.visible")
        .and("have.text", token);
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
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@records").then(({ response: { body } }) => {
        const { records } = body;
        shortToken = getFirstShortProposalToken(records);
        token = records[shortToken].censorshiprecord.token;
        expect(shortToken, "You should have at least one record Under Review.")
          .to.exist;
      });
    });
    it("should publicly allow to download proposal bundle", () => {
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.findByTestId("record-links").click();
      cy.findByText(/proposal bundle/i).click();
      const downloadsFolder = Cypress.config("downloadsFolder");
      cy.readFile(path.join(downloadsFolder, `${shortToken}-v1.json`)).should(
        "exist"
      );
    });
    it("should publicly allow to download proposal timestamps", () => {
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.findByTestId("record-links").click();
      cy.findByText(/proposal timestamps/i).click();
      const config = Cypress.config();
      const downloadsFolder = Cypress.config("downloadsFolder");
      cy.readFile(
        path.join(downloadsFolder, `${shortToken}-v1-timestamps.json`)
      ).should("exist");
    });
  });
  describe("invalid proposal rendering", () => {
    it("should dislpay not found message for nonexistent proposals", () => {
      cy.visit("/record/invalidtoken");
      cy.wait("@details").its("response.statusCode").should("eq", 400);
    });
  });
  describe("user proposals actions", () => {
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    beforeEach(() => {
      cy.login(admin);
      cy.identity();
      const proposal = buildProposal();
      cy.createProposal(proposal).then(
        ({
          body: {
            record: {
              censorshiprecord: { token }
            }
          }
        }) => {
          cy.visit("/admin/records");
          cy.wait("@records").then(({ response: { body } }) => {
            const { records } = body;
            shortToken = getFirstShortProposalToken(records);
            expect(shortToken, "You should have at least one unvetted record.")
              .to.exist;
          });
        }
      );
    });
    it("should be able to logout from unvetted proposal details page", () => {
      cy.middleware("comments.comments", 10, 1);
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.findByTestId("record-header").should("be.visible");
      cy.findByTestId("markdown-wrapper").should("exist");
      cy.userLogout(admin.username);
      cy.wait(2000);
      // assert that proposal files were removed from store
      cy.findByTestId("record-header").should("be.visible");
      cy.findByTestId("markdown-wrapper").should("not.exist");
      cy.get("#commentArea").should("not.exist");
    });
    it("should render unvetted proposal details after admin/author login", () => {
      cy.visit("/");
      cy.wait("@records");
      cy.userLogout(admin.username);
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait(1000);
      cy.findByTestId("wayt-login-button").click();
      cy.typeLoginModal(admin);
      cy.wait("@details");
      cy.findByTestId("markdown-wrapper").should("exist");
      cy.get("#commentArea").should("exist");
    });
  });
  describe.only("proposal status tags", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.wait("@records").then(({ response: { body } }) => {
        const { records } = body;
        shortToken = getFirstShortProposalToken(records);
        token = records[shortToken].censorshiprecord.token;
        expect(shortToken, "You should have at least one record Under Review.")
          .to.exist;
      });
    });
    it("should display unvetted status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // unvetted.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNVETTED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/unvetted/i).should("be.visible");
    });
    it("should display unvetted censored status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // unvetted censored.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/censored/i).should("be.visible");
    });
    it("should display unvetted abandoned status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // unvetted abandoned.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/Abandoned/).should("be.visible");
    });
    it("should display censored status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // censored.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_CENSORED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/censored/i).should("be.visible");
    });
    it("should display abandoned status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // abandoned.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_ABANDONED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/Abandoned/).should("be.visible");
    });
    it("should display under review status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // under review.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/waiting for author to authorize voting/i).should(
        "be.visible"
      );
    });
    it("should display vote authorized status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // vote authorized.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/waiting for admin to start voting/i).should("be.visible");
    });
    it("should display vote authorized status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // vote started.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_VOTE_STARTED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/voting/i).should("be.visible");
    });
    it("should display rejected status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // rejected.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_REJECTED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/rejected/i).should("be.visible");
    });
    it("should display active status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // active.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_ACTIVE
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/active/i).should("be.visible");
    });
    it("should display closed status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // closed.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_CLOSED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/closed/i).should("be.visible");
    });
    it("should display completed status tag properly", () => {
      // Mock propsoal summary reply to set proposal status to
      // completed.
      cy.middleware("pi.summaries", {
        token,
        status: PROPOSAL_SUMMARY_STATUS_COMPLETED
      });
      cy.visit(`/record/${shortToken}`);
      cy.wait("@details");
      cy.wait("@pi.summaries");
      cy.findByText(/completed/i).should("be.visible");
    });
  });
});
