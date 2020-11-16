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
    cy.login(user);
    cy.identity();
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      // logout
      cy.logout(user);
      // login non-paid user
      const user4 = {
        email: "user4@example.com",
        username: "user4",
        password: "password"
      };
      cy.login(user4);
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByRole("button", { name: /add comment/i }).should("be.disabled");
      cy.findByText(
        /submit comments or proposals before paying the paywall/i
      ).should("exist");
    });
  });

  it("Can comment, vote and reply if paid the paywall", () => {
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
    cy.createProposal(proposal).then((res) => {
      cy.approveProposal(res.body.censorshiprecord);
      // logout
      cy.logout(user);
      // login non-paid user
      const user2 = {
        email: "user2@example.com",
        username: "user2",
        password: "password"
      };
      cy.login(user2);
      cy.identity();
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      const { text } = buildComment();
      cy.findByTestId(/text-area/i).type(text);
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
});
