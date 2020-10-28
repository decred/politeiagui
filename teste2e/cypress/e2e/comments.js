import { buildProposal, buildComment } from "../support/generate";

describe("User comments", () => {
  it("Can not comment if hasn't paid the paywall", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).click();
    cy.findByText(/approve/i).click();
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findByText(/Waiting for author/i).should("exist");
    // logout
    cy.logout(user);
    // login non-paid user
    const user2 = {
      email: "user2@example.com",
      username: "user2",
      password: "password"
    };
    cy.typeLogin(user2);
    cy.findByText(proposal.name).click();
    cy.findByRole("button", { name: /add comment/i }).should("be.disabled");
    cy.findByText(
      /submit comments or proposals before paying the paywall/i
    ).should("exist");
  });
  it.only("Can comment, vote and reply if paid the paywall", () => {
    cy.server();
    // create proposal
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal(proposal);
    cy.route("POST", "/api/v1/proposals/batchvotesummary").as("unvettedLoaded");
    cy.visit("/proposals/unvetted");
    cy.wait("@unvettedLoaded");
    cy.findByText(proposal.name).click();
    cy.findByText(/approve/i).click();
    cy.route("POST", "/api/v1/proposals/**/status").as("confirm");
    cy.findByText(/confirm/i).click();
    cy.wait("@confirm");
    cy.findByText(/ok/i).click();
    cy.findByText(/Waiting for author/i).should("exist");
    // logout
    cy.logout(user);
    // login paid user
    const user1 = {
      email: "user1@example.com",
      username: "user1",
      password: "password"
    };
    cy.typeLogin(user1);
    cy.typeIdentity();
    cy.visit("/");
    cy.findByText(proposal.name).click();
    const { text } = buildComment();
    cy.findByTestId(/text-area/i, { timeout: 10000 }).type(text);
    cy.route("POST", "/api/v1/comments/new").as("newComment");
    cy.findByText(/add comment/i).click();
    cy.wait("@newComment");
    cy.route("POST", "/api/v1/comments/like").as("likeComment");
    cy.findByTestId("like-btn").click();
    cy.wait("@likeComment").its("status").should("eq", 200);
    cy.findByText(/reply/i).click();
    cy.findAllByTestId(/text-area/i)
      .eq(1)
      .type(text);
    cy.findAllByText(/add comment/i)
      .eq(1)
      .click();
    cy.wait("@newComment").its("status").should("eq", 200);
  });
});
