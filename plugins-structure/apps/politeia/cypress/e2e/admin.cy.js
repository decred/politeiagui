import { mockRecordsInventory } from "@politeiagui/core/dev/mocks";

Cypress.Commands.add("mockInventory", (amount, matcherParams = {}) =>
  cy.mockResponse(
    { url: "/api/records/v1/inventory", ...matcherParams },
    mockRecordsInventory(amount)
  )
);

describe("Admin Proposals Page", () => {
  beforeEach(() => {
    cy.mockProposalsBatch("unreviewed");
    cy.mockInventory(0);
  });
  it("should show empty list message when inventory is empty", () => {
    cy.mockInventory(0);
    cy.visit("/admin/records");
    cy.assertProposalsListLength(0);
    cy.findByTestId("proposals-list-empty").should("be.visible");
    cy.findByTestId("tab-1").click();
    cy.findByTestId("proposals-list-empty").should("be.visible");
  });
  it("should list unvetted unreviewed proposals", () => {
    cy.mockInventory(10);
    cy.visit("/admin/records");
    cy.waitProposalsBatch();
    cy.findAllByTestId("proposal-card").last().scrollIntoView({
      easing: "linear",
      duration: 500,
    });
    cy.waitProposalsBatch({ hasCounts: false });
    cy.assertProposalsListLength(10);
  });
  it("should list unvetted censored proposals", () => {
    cy.mockProposalsBatch("unvettedCensored");
    cy.mockInventory(10);
    cy.visit("/admin/records");
    cy.waitProposalsBatch();
    cy.findAllByTestId("proposal-card").last().scrollIntoView({
      easing: "linear",
      duration: 500,
    });
    cy.waitProposalsBatch({ hasCounts: false });
    cy.assertProposalsListLength(10);
  });
});

describe("User Search Page", () => {
  it("should list users", () => {
    cy.visit("/admin/search");
    cy.findByText("Search for Users").should("be.visible");
    cy.findByTestId("admin-search-email").type("test");
    cy.findByTestId("admin-search-button").click();

    // Should display list of users on table
    cy.findByTestId("admin-search-results").should("be.visible");
  });
});
