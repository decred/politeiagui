import {
  buildProposal,
  buildComment,
  buildAuthorUpdate
} from "../../support/generate";
import { shortRecordToken, PROPOSAL_VOTING_APPROVED } from "../../utils";

describe("Proposal author updates", () => {
  it("Should allow proposal author to submit update on approved proposals, and normal users should be able to reply on the latest author update only", () => {
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
        // Mock vote summary reply to set proposal vote status to
        // approved to test author updates.
        cy.middleware("ticketvote.summaries", {
          token,
          status: PROPOSAL_VOTING_APPROVED
        });
        cy.visit(`record/${shortRecordToken(token)}`);
        cy.wait("@ticketvote.summaries");
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
});
