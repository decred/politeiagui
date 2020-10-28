describe("User admin comments", () => {
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
    const { text } = buildComment();
    cy.findByTestId(/text-area/i, { timeout: 10000 }).type(text);
    cy.route("POST", "/api/v1/comments/new").as("newComment");
    cy.findByText(/add comment/i).click();
    cy.wait("@newComment");
    cy.route("POST", "/api/v1/comments/like").as("likeComment");
    cy.findByTestId("like-btn").click();
    cy.wait("@likeComment").its("status").should("eq", 200);
  });
});
