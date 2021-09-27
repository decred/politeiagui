import { buildProposal, buildComment } from "../../support/generate";
import { shortRecordToken, getFirstShortProposalToken } from "../../utils";
import path from "path";

describe("User comments", () => {
  it("Shouldn't allow submitting new comments if paywall not paid", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        // logout
        cy.logout(user);
        // login non-paid user
        const user3 = {
          email: "user3@example.com",
          username: "user3",
          password: "password"
        };
        cy.login(user3);
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        cy.findByRole("button", { name: /add comment/i }).should("be.disabled");
        cy.findByText(
          /you won't be able to submit comments or proposals before paying the paywall/i
        ).should("be.visible");
      }
    );
  });
  it("Should allow user who paid the paywall to add new comments & vote or reply on others' comments", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        // logout
        cy.logout(user);
        // login paid user
        const user1 = {
          email: "user1@example.com",
          username: "user1",
          password: "password"
        };
        cy.login(user1);
        cy.identity();
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        const { text } = buildComment();
        cy.findByTestId(/text-area/i).type(text);
        cy.route("POST", "/api/comments/v1/new").as("newComment");
        cy.findByText(/add comment/i).click();
        cy.wait("@newComment").its("status").should("eq", 200);
        // Comment author can't vote on his own comment so we login as the
        // admin user again to vote on the comment.
        cy.logout(user1);
        cy.login(user);
        cy.identity();
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        cy.route("POST", "/api/comments/v1/vote").as("likeComment");
        cy.findByTestId("like-btn").click();
        cy.wait("@likeComment", { timeout: 10000 })
          .its("status")
          .should("eq", 200);
        cy.findByText(/reply/i).click();
        cy.findAllByTestId(/text-area/i)
          .eq(1)
          .type(text);
        cy.findAllByText(/add comment/i)
          .eq(1)
          .click();
        cy.wait("@newComment").its("status").should("eq", 200);
      }
    );
  });
});
describe("Comments downloads", () => {
  let shortToken = "";
  beforeEach(() => {
    cy.server();
    cy.intercept("/api/records/v1/records").as("records");
    cy.intercept("/api/records/v1/details").as("details");
    cy.visit("/");
    cy.wait("@records").then(({ response: { body } }) => {
      const { records } = body;
      shortToken = getFirstShortProposalToken(records);
      expect(shortToken, "You should have at least one record Under Review.").to
        .exist;
      // login paid user
      const user1 = {
        email: "user1@example.com",
        username: "user1",
        password: "password"
      };
      cy.login(user1);
      cy.identity();
      cy.visit(`record/${shortToken}`);
      const { text } = buildComment();
      cy.findByTestId(/text-area/i).type(text);
      cy.route("POST", "/api/comments/v1/new").as("newComment");
      cy.findByText(/add comment/i).click();
      cy.wait("@newComment").its("status").should("eq", 200);
      cy.intercept("/api/comments/v1/comments").as("comments");
      cy.intercept("/api/comments/v1/votes").as("votes");
    });
  });
  it("should publicly allow users to download comments bundle", () => {
    cy.visit(`/record/${shortToken}`);
    cy.wait("@details");
    cy.wait("@comments");
    cy.wait("@votes");
    cy.findByTestId("record-links").click();
    cy.findByText(/comments bundle/i).click();
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.readFile(
      path.join(downloadsFolder, `${shortToken}-comments.json`)
    ).should("exist");
  });
  it("should publicly allow users to download comments timestamps", () => {
    cy.visit(`/record/${shortToken}`);
    cy.wait("@details");
    cy.wait("@comments");
    cy.wait("@votes");
    cy.findByTestId("record-links").click();
    cy.findByText(/comments timestamps/i).click();
    const downloadsFolder = Cypress.config("downloadsFolder");
    cy.readFile(
      path.join(downloadsFolder, `${shortToken}-comments-timestamps.json`)
    ).should("exist");
  });
});
describe("Comments error handling", () => {
  let token = "";
  beforeEach(() => {
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    cy.login(user);
    cy.intercept("/api/ticketvote/v1/inventory").as("inventory");
    cy.visit("/");
    cy.wait("@inventory").then(({ response: { body } }) => {
      token = body.vetted.unauthorized[0];
    });
  });
  it("should display login modal when commenting with an expired user session", () => {
    cy.middleware("comments.new", { errorCode: 403 });
    cy.wait(1000);
    cy.visit(`/record/${shortRecordToken(token)}`);
    cy.findByTestId(/text-area/i).type("new comment");
    cy.findByTestId(/comment-submit-button/i).click();
    cy.wait("@comments.new");
    cy.findByTestId("modal-login").should("exist");
  });
});
