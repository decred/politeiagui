import {
  buildProposal,
  buildComment,
  buildAuthorUpdate
} from "../../support/generate";
import {
  shortRecordToken,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_CLOSED,
  PROPOSAL_SUMMARY_STATUS_COMPLETED
} from "../../utils";

describe("Proposal author updates", () => {
  it("Should allow proposal author to submit updates on active proposals & allow normal users to reply only on the latest author update", () => {
    // paid admin user with proposal credits
    cy.server();
    // create proposal
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const user1 = {
      email: "user1@example.com",
      username: "user1",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(admin);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: {
            censorshiprecord: { token }
          }
        }
      }) => {
        cy.visit(`record/${shortRecordToken(token)}`);
        // Manually approve proposal
        cy.findByText(/approve/i).click();
        cy.route("POST", "/api/records/v1/setstatus").as("setstatus");
        cy.findByText(/confirm/i).click();
        cy.wait("@setstatus");
        // Mock propsoal summary reply to set proposal status to
        // approved to test author updates.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_ACTIVE
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.summaries");
        const { title, text } = buildAuthorUpdate();
        cy.findByTestId(/update-title/i).type(title);
        cy.findByTestId(/text-area/i).type(text);
        cy.route("POST", "/api/comments/v1/new").as("newComment");
        cy.findByText(/add comment/i).click();
        cy.wait("@newComment").its("status").should("eq", 200);
        // Ensure new comments section title is the author update title.
        cy.findByText(title).should("be.visible");

        // Normal users shouldn't be able to post normal comments at this level
        // and only reply on latest author update thread.
        cy.logout(admin);
        cy.login(user1);
        cy.identity();
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.summaries");
        cy.findByTestId(/text-area/i).should("not.exist");
        const { text: replyText } = buildComment();
        cy.findByText(/reply/i).click();
        cy.findByTestId(/text-area/i).type(replyText);
        cy.route("POST", "/api/comments/v1/new").as("newComment");
        cy.findByText(/add comment/i).click();
        cy.wait("@newComment").its("status").should("eq", 200);
        // Ensure new reply is displayed in the author update thread.
        cy.wait(1000);
        cy.findByText(replyText).should("be.visible");
      }
    );
  });

  it("Shouldn't allow proposal author to submit updates on closed proposals", () => {
    // paid admin user with proposal credits
    cy.server();
    // create proposal
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const user1 = {
      email: "user1@example.com",
      username: "user1",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(admin);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: {
            censorshiprecord: { token }
          }
        }
      }) => {
        cy.visit(`record/${shortRecordToken(token)}`);
        // Manually approve proposal
        cy.findByText(/approve/i).click();
        cy.route("POST", "/api/records/v1/setstatus").as("setstatus");
        cy.findByText(/confirm/i).click();
        cy.wait("@setstatus");
        // Mock propsoal summary reply to set proposal status to
        // closed.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_CLOSED
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.summaries");
        cy.findByTestId(/update-title/i).should("not.exist");
      }
    );
  });

  it("Shouldn't allow proposal author to submit updates on completed proposals", () => {
    // paid admin user with proposal credits
    cy.server();
    // create proposal
    const admin = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const user1 = {
      email: "user1@example.com",
      username: "user1",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(admin);
    cy.identity();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: {
            censorshiprecord: { token }
          }
        }
      }) => {
        cy.visit(`record/${shortRecordToken(token)}`);
        // Manually approve proposal
        cy.findByText(/approve/i).click();
        cy.route("POST", "/api/records/v1/setstatus").as("setstatus");
        cy.findByText(/confirm/i).click();
        cy.wait("@setstatus");
        // Mock propsoal summary reply to set proposal status to
        // completed.
        cy.middleware("pi.summaries", {
          token,
          status: PROPOSAL_SUMMARY_STATUS_COMPLETED
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@pi.summaries");
        cy.findByTestId(/update-title/i).should("not.exist");
      }
    );
  });
});
