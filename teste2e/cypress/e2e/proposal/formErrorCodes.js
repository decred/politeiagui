import { buildProposal } from "../../support/generate";
import { USER_TYPE_ADMIN } from "../../support/users/generate";

beforeEach(function mockApiCalls() {
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
});

describe("Proposal Form Error Codes Mapping", () => {
  beforeEach(() => {
    cy.server();
    cy.userEnvironment(USER_TYPE_ADMIN, { verifyIdentity: true });
  });

  it("Should map invalid name error code to a readable error message", () => {
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {
      error: { statuscode: 400, errorcode: 6, pluginid: "pi", errorcontext: "" }
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@records.new");
    cy.contains(/Error: Proposal name is invalid/i).should("be.visible");
  });

  it("Should map invalid start date error code to a readable error message", () => {
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {
      error: { statuscode: 400, errorcode: 8, pluginid: "pi", errorcontext: "" }
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@records.new");
    cy.contains(/Error: Proposal start date is invalid/i).should("be.visible");
  });

  it("Should map invalid end date error code to a readable error message", () => {
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {
      error: { statuscode: 400, errorcode: 9, pluginid: "pi", errorcontext: "" }
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@records.new");
    cy.contains(/Error: Proposal end date is invalid/i).should("be.visible");
  });

  it("Should map invalid amount error code to a readable error message", () => {
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {
      error: {
        statuscode: 400,
        errorcode: 10,
        pluginid: "pi",
        errorcontext: ""
      }
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@records.new");
    cy.contains(/Error: Proposal amount is invalid/i).should("be.visible");
  });

  it("Should map invalid domain error code to a readable error message", () => {
    const proposal = buildProposal();
    cy.recordsMiddleware("new", {
      error: {
        statuscode: 400,
        errorcode: 11,
        pluginid: "pi",
        errorcontext: ""
      }
    });
    cy.piMiddleware("summaries", { amountByStatus: { unvetted: 1 } });
    cy.visit("/record/new");
    cy.typeCreateProposal(proposal);
    cy.findByRole("button", { name: /submit/i }).click();
    cy.wait("@records.new");
    cy.contains(/Error: Proposal domain is invalid/i).should("be.visible");
  });
});
