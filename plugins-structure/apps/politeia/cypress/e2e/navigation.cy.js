import {
  mockTicketvoteInventory,
  mockTicketvoteSummaries,
} from "@politeiagui/ticketvote/dev/mocks";
import {
  mockComments,
  mockCommentsCount,
} from "@politeiagui/comments/dev/mocks";
import { mockRecordsBatch } from "@politeiagui/core/dev/mocks";
import {
  mockPiSummaries,
  mockProposal,
  mockProposalDetails,
} from "../../src/pi/dev/mocks";

const customToken = "abcdefghijklmnop";
const mockPublicProposal = mockProposal({ state: 2, status: 2 });

function assertRequestsNotDuplicated(res) {
  const [details, list] = res;
  const [detailsToken] = details.request.body.tokens;
  const listTokens = list.request.body.tokens;

  expect(details.request.body.tokens).to.have.length(1);
  expect(listTokens).to.not.include(detailsToken);
}

beforeEach(() => {
  cy.mockResponse(
    "/api/ticketvote/v1/inventory",
    mockTicketvoteInventory(10, [customToken])
  ).as("inventory");
  cy.mockResponse("/api/comments/v1/count", mockCommentsCount()).as("counts");
  cy.mockResponse(
    "/api/records/v1/records",
    mockRecordsBatch(mockPublicProposal)
  ).as("records");
  cy.mockResponse("/api/comments/v1/comments", mockComments({ amount: 5 })).as(
    "comments"
  );
  cy.mockResponse(
    "/api/records/v1/details",
    mockProposalDetails({ status: 2, state: 2, body: "Test!", customToken })
  ).as("details");
  cy.mockResponse("/api/ticketvote/v1/summaries", mockTicketvoteSummaries()).as(
    "voteSummaries"
  );
  cy.mockResponse("/api/pi/v1/summaries", mockPiSummaries()).as("piSummaries");
});

describe("Given Politeia app navigation", () => {
  it("should navigate to Details page when clicking on Proposal card", () => {
    cy.visit("/");
    cy.findAllByTestId("record-card-title-link").first().click();
    // Should fetch details, comments and pi summaires
    cy.wait("@details");
    cy.wait("@comments");
    cy.wait("@piSummaries");
    // Assert page loaded and url is correct with short token.
    cy.findByTestId("proposal-details").should("be.visible");
    cy.location().its("pathname").should("eq", "/record/abcdefg");
    // List already loads voteSummaries. Details don't need to load again.
    cy.get("@voteSummaries.all").should("have.length", 1);
    // Details page requests only fetched once.
    cy.get("@details.all").should("have.length", 1);
    cy.get("@comments.all").should("have.length", 1);
    cy.get("@piSummaries.all").should("have.length", 1);
  });

  it("should navigate to home page when clicking on Politeia logo", () => {
    cy.visit("/record/abcdefg");
    cy.findByTestId("proposal-details").should("be.visible");
    // Navigate to home using Logo link
    cy.findByTestId("politeia-logo").click();
    // Record from details won't be fetched again
    cy.wait("@records")
      .its("request.body.requests")
      .should((reqs) => {
        const tokens = reqs.map((r) => r.token);
        expect(tokens).to.not.include(customToken);
      });
    cy.wait("@inventory");
    // Render under review tab
    cy.findByTestId("proposals-under-review-list").should("be.visible");
    // Summaries from details shouldn't be fetched again
    cy.get("@voteSummaries.all")
      .should("have.length", 2)
      .then(assertRequestsNotDuplicated);
  });

  it("shouldn't fetch duplicated data", () => {
    cy.visit("/");
    // navigate to details page
    cy.findAllByTestId("record-card-title-link").first().click();
    cy.findByTestId("proposal-details").should("be.visible");
    // Back to home
    cy.findByTestId("politeia-logo").click();
    cy.findByTestId("proposals-under-review-list").should("be.visible");
    // Assert home requests aren't duplicated
    cy.get("@inventory.all").should("have.length", 1);
    cy.get("@records.all").should("have.length", 1);
    cy.get("@counts.all").should("have.length", 1);
    // Details page again
    cy.findAllByTestId("record-card-title-link").first().click();
    cy.findByTestId("proposal-details").should("be.visible");
    // Assert details page aren't duplicated
    cy.get("@details.all").should("have.length", 1);
    cy.get("@piSummaries.all").should("have.length", 1);
    cy.get("@comments.all").should("have.length", 1);
  });
});