import { buildProposal } from "../support/generate";

describe("Proposal Create", () => {
  // XXX This test needs changes in the Datepicker and (probably) the Select
  // components, in order to fill the new form fields such as: start & end dates
  // and amount - issue to track <insert issue link>
  //
  /*it("Paid user can create proposals manually", () => {
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
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
  });*/

  it("Non-paid user can not create proposals", () => {
    const user = {
      email: "user3@example.com",
      username: "user3",
      password: "password"
    };
    cy.login(user);
    cy.visit("/");
    cy.findByText(/new proposal/i).should("be.disabled");
    cy.visit("/record/new");
    cy.findByText(
      /you won't be able to submit comments or proposals before paying the paywall/i
    ).should("be.visible");
    const proposal = buildProposal();
    cy.findByTestId("proposal-name").should("be.visible").type(proposal.name);
    cy.findByTestId("text-area").type(proposal.description);
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});
