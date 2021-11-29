import { buildProposal } from "../../support/generate";
import {
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_UNVETTED
} from "../../utils";

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
  it("Paid user can create proposals manually", () => {
    // paid user with proposal credits
    cy.userEnvironment("user", { verifyIdentity: true });
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {});
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
  });

  it("Non-paid user can not create proposals", () => {
    cy.userEnvironment("unpaid", { verifyIdentity: true });
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
