import { buildProposal } from "../../support/generate";
import { userByType, USER_TYPE_USER } from "../../support/users/generate";

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
  it("should allow paid user to create proposals", () => {
    // paid user with proposal credits
    cy.userEnvironment("user", { verifyIdentity: true });
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {});
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@records.new");
  });

  it("should not be able to create proposals without fill the input", () => {
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

  it("should not be able create proposals with non-paid user", () => {
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
  describe("Given some pre loaded drafts list", () => {
    const user = userByType(USER_TYPE_USER);
    const state = {
      app: {
        draftProposals: {
          newDraft: true,
          lastSubmitted: "SUMIFSN",
          draft_epv5gj2bi: {
            name: "Test Draft",
            description: "Draft Description",
            files: [],
            rfpDeadline: null,
            type: 1,
            rfpLink: "",
            timestamp: 1645039299,
            id: "draft_epv5gj2bi",
            draftId: "draft_epv5gj2bi"
          }
        }
      }
    };
    it("should be able to restore proposal data from drafts", () => {
      cy.userEnvironment("user", { verifyIdentity: true, user });
      cy.setLocalStorage(`state-${user.userid}`, JSON.stringify(state));
      cy.visit("/record/new");
      cy.findByTestId("proposal-new-draft-button").click();
      cy.findByText("Test Draft").should("be.visible").click();
      cy.findByTestId("proposal-name").should("have.value", "Test Draft");
      cy.findByTestId("text-area").should("have.value", "Draft Description");
    });
  });

  describe("Given an empty drafts list", () => {
    it("should not display drafts button", () => {
      cy.userEnvironment("user", { verifyIdentity: true });
      cy.visit("/record/new");
      cy.get("[data-testid=proposal-new-draft-button]").should("not.exist");
    });
  });
});
