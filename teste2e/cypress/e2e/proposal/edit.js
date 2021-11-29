import { buildProposal } from "../../support/generate";
import { shortRecordToken } from "../../utils";

describe("Proposal Edit", () => {
  const user = {
    email: "adminuser@example.com",
    username: "adminuser",
    password: "password"
  };

  beforeEach(() => {
    cy.server();
    cy.login(user);
    cy.identity();
  });

  it("Can edit a public proposal as a proposal owner", () => {
    // create proposal
    const proposal = buildProposal();
    const { description: newDescription } = buildProposal();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        cy.intercept("/api/records/v1/details").as("details");
        cy.intercept("/api/ticketvote/v1/summaries").as("summaries");
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        // user is able to edit the proposal
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
        cy.findByText(/version 2/).should("exist");
        cy.findByTestId("proposal-published-timestamp").should("be.visible");
        cy.findByTestId("proposal-edited-timestamp").should("be.visible");
      }
    );
  });

  it("Can't edit a proposal if not the owner", () => {
    // create proposal
    const proposal = buildProposal();
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
        cy.findByTestId(/record-edit-button/i).should("not.exist");
        cy.findByTestId("proposal-published-timestamp").should("be.visible");
        cy.findByTestId("proposal-edited-timestamp").should("not.exist");
      }
    );
  });

  it("Can't edit an authorized voting proposal", () => {
    const proposal = buildProposal();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        cy.route("POST", "api/ticketvote/v1/authorize").as("authorizeVote");
        cy.findByRole("button", { name: /authorize voting/i }).click();
        cy.findByRole("button", { name: /confirm/i }).click();
        cy.wait("@authorizeVote", { timeout: 3000 })
          .its("status")
          .should("eq", 200);
        cy.findByTestId(/modal-confirm-success-msg/i).click();
        cy.findByTestId(/record-edit-button/i).should(
          "have.css",
          "pointer-events",
          "none"
        );
      }
    );
  });

  it("Can't edit without making any changes", () => {
    // create proposal
    const proposal = buildProposal();
    cy.createProposal(proposal).then(
      ({
        body: {
          record: { censorshiprecord }
        }
      }) => {
        cy.approveProposal(censorshiprecord);
        cy.visit(`record/${shortRecordToken(censorshiprecord.token)}`);
        cy.wait(3000);
        cy.findByTestId(/record-edit-button/i).click();
        cy.findByRole("button", { name: /submit/i }).should("be.disabled");
      }
    );
  });
});
