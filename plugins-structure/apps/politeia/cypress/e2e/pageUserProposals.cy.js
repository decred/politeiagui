import { mockRecordsInventory } from "@politeiagui/core/dev/mocks";

Cypress.Commands.add("mockInventory", (amount, matcherParams = {}) =>
  cy.mockResponse(
    { url: "/api/records/v1/inventory", ...matcherParams },
    mockRecordsInventory(amount)
  )
);

beforeEach(() => {
  cy.mockProposalsBatch("unauthorized");
  cy.mockInventory(0);
});

describe("Given User Proposals page", () => {
  it("should load user proposals", () => {
    cy.mockInventory(10);
    cy.visit("/user/user-test-id/proposals");
    cy.waitProposalsBatch();
    cy.findAllByTestId("proposal-card").last().scrollIntoView({
      easing: "linear",
      duration: 500,
    });
    cy.waitProposalsBatch({ hasCounts: false });
    cy.assertProposalsListLength(10);
  });
  it("should show empty list message when inventory is empty", () => {
    cy.mockInventory(0);
    cy.visit("/user/user-test-id/proposals");
    cy.assertProposalsListLength(0);
    cy.findByTestId("proposals-list-empty").should("be.visible");
  });
});
