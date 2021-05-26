import { buildProposal, buildComment } from "../support/generate";
import { shortRecordToken } from "src/helpers";

describe("User admin comments", () => {
  it("Can censor comments", () => {
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
    cy.createProposal(proposal).then(({ body: { record } }) => {
      cy.approveProposal(record.censorshiprecord);
      cy.visit(`record/${shortRecordToken(record.censorshiprecord.token)}`);
      cy.findByText(/waiting for author/i).should("exist");
      const { text } = buildComment();
      cy.findByTestId(/text-area/i).type(text);
      cy.route("POST", "/api/comments/v1/new").as("newComment");
      cy.findByText(/add comment/i).click();
      cy.wait("@newComment");
      cy.findByText(/censor/i).click();
      cy.findByLabelText(/censor reason/i).type("censor");
      cy.route("POST", "/api/comments/v1/del").as("confirm");
      cy.findByText(/confirm/i).click();
      cy.wait("@confirm");
      cy.findByText(/ok/i).click();
      cy.findByText(/censored/i).should("exist");
    });
  });
});
