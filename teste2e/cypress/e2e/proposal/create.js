import { buildProposal } from "../../support/generate";

beforeEach(function mockApiCalls() {
  // currently mocking pi and ticketvote summaries calls with any status, since
  // they aren't used for assertions.
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
  cy.useCommentsApi();
});

describe("Proposal Create", () => {
  // XXX This test needs changes in the Datepicker and (probably) the Select
  // components, in order to fill the new form fields such as: start & end dates
  // and amount - issue to track <insert issue link>
  //
  it("should be able to create proposals", () => {
    // paid user with proposal credits
    cy.userEnvironment("user", { verifyIdentity: true });
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {});
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    // needs more time in general to complete this request so we increase the
    // responseTimeout
    cy.wait("@newProposal").should((xhr) => {
      expect(xhr.status).to.equal(200);
      cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
      const token = xhr.response.body.record.censorshiprecord.token;
      cy.assertProposalPage({
        ...proposal,
        token: token
      });
      cy.wait("@pi.summaries", { timeout: 500 });
      cy.findByTestId("record-title").should("have.text", proposal.name);
    });
  });

  it("Proposal can not be created without fill the input", () => {
    // paid user with proposal credits
    cy.userEnvironment("user", { verifyIdentity: true });
    cy.recordsMiddleware("new", {});
    cy.visit("/record/new");
    cy.findByRole("button", { name: /submit/i }).click();
    cy.findByTestId("proposal-name").parent().find("p").contains("Required");
    cy.findByTestId("proposal-amount").parent().find("p").contains("Required");
    cy.get("[data-testid=datepicker]:eq(0)")
      .find("p")
      .contains("Please pick a start date");
    cy.get("[data-testid=datepicker]:eq(1)")
      .find("p")
      .contains("Please pick an end date");
  });

  it("Non-paid user can not create proposals", () => {
    cy.userEnvironment("unpaid", { verifyIdentity: true });
    cy.visit("/");
    cy.findByText(/new proposal/i).should("be.disabled");
    const proposal = buildProposal();
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByText(
      /you won't be able to submit comments or proposals before paying the paywall/i
    ).should("be.visible");
    cy.findByRole("button", { name: /submit/i }).should("be.disabled");
  });
});
