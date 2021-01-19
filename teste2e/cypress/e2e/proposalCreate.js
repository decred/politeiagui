import { buildProposal } from "../support/generate";

describe("Proposals", () => {
  it("Paid user can create RFP proposals", () => {
    // paid user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.identity();
    // create a RFP proposal via API
    cy.createRfpProposal(proposal).then((res) => {
      cy.visit(`proposals/${res.body.censorshiprecord.token.substring(0, 7)}`);
      cy.findByAltText(/rfp/).should("exist");
    });
  });

  it("Paid user can create proposals manually", () => {
    // paid user with proposal credits
    const user = {
      email: "adminuser@example.com",
      username: "adminuser",
      password: "password"
    };
    const proposal = buildProposal();
    cy.login(user);
    cy.visit("/");
    cy.identity();
    cy.visit("/proposals/new");
    cy.typeCreateProposal(proposal);
  });

  it("Non-paid user can not create proposals", () => {
    const user = {
      email: "user3@example.com",
      username: "user3",
      password: "password"
    };
    cy.login(user);
    cy.visit("/");
    cy.findByText(/new proposal/i).should("be.disabled");
    cy.visit("/proposals/new");
    cy.findByText(
      /you won't be able to submit comments or proposals before paying the paywall/i
    ).should("be.visible");
    const proposal = buildProposal();
    cy.findByTestId("proposal-name").should("be.visible").type(proposal.name);
    cy.findByTestId("text-area").type(proposal.description);
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});
