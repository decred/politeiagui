import { buildProposal } from "../support/generate";

describe("Proposals", () => {
  it("Paid user can create proposals", () => {
    cy.visit("/");
    // paid user with proposal credits
    const user = {
      email: "admin@example.com",
      username: "admin",
      password: "password"
    };
    cy.typeLogin(user);
    cy.typeIdentity();
    cy.typeCreateProposal();
  });

  it("Non-paid user can not create proposals", () => {
    cy.visit("/");
    const user = {
      email: "nonpaid@example.com",
      username: "nonpaid",
      password: "password"
    };
    cy.typeLogin(user);
    cy.findByText(/new proposal/i).should("be.disabled");
    cy.visit("/proposals/new");
    cy.findByText(
      /you won't be able to submit comments or proposals before paying the paywall/i
    ).should("be.visible");
    const proposal = buildProposal();
    cy.findByTestId("proposal name", { timeout: 10000 }).type(proposal.name);
    cy.findByTestId("text-area").type(proposal.description);
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});
