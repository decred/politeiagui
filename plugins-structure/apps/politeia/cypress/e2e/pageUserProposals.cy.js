import { mockCommentsCount } from "@politeiagui/comments/dev/mocks";
import {
  mockRecordsBatch,
  mockRecordsInventory,
} from "@politeiagui/core/dev/mocks";
import { mockTicketvoteSummaries } from "@politeiagui/ticketvote/dev/mocks";
import {
  mockPiBillingStatusChanges,
  mockPiSummaries,
  mockProposal,
} from "../../src/pi/dev/mocks";

Cypress.Commands.add("mockInventory", (amount, matcherParams = {}) =>
  cy.mockResponse(
    { url: "/api/records/v1/inventory", ...matcherParams },
    mockRecordsInventory(amount)
  )
);

beforeEach(() => {
  cy.mockResponse("/api/comments/v1/count", mockCommentsCount()).as("counts");
  cy.mockResponse(
    "/api/records/v1/records",
    mockRecordsBatch(mockProposal({ state: 2, status: 2 }))
  ).as("records");
  cy.mockResponse("/api/ticketvote/v1/summaries", mockTicketvoteSummaries()).as(
    "summaries"
  );
  cy.mockResponse("/api/pi/v1/summaries", mockPiSummaries()).as("piSummaries");
  cy.mockResponse(
    "/api/pi/v1/billingstatuschanges",
    mockPiBillingStatusChanges()
  ).as("billingstatuschanges");
  cy.mockInventory(0);
});

describe("Given User Proposals page", () => {
  it("should load user proposals", () => {
    cy.mockInventory(10);
    cy.visit("/user/user-test-id/proposals");
  });
});
