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
const shortToken = customToken.slice(0, 7);
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
    cy.findByTestId("tab-0")
      .should("be.visible")
      .and("have.css", "border-color");
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
    cy.findByTestId("tab-0")
      .should("be.visible")
      .and("have.css", "border-color");
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

  it("should allow 'go back link' navigation on details page", () => {
    cy.visit("/");
    cy.findAllByTestId("record-card-title-link").first().click();
    cy.findByTestId("proposal-go-back").should("be.visible").click();
    // navigate back to home
    cy.findAllByTestId("record-card-title-link").should("be.visible");
    cy.location("pathname").should("eq", "/");
    // navigate to record details and go to some comment page
    cy.visit(`/record/${shortToken}`);
    cy.findAllByTestId("comment-card-footer-link").first().click();
    cy.findByTestId("proposal-go-back").should("not.exist");
    cy.findByTestId("comments-view-all-link").click();
    cy.findByTestId("proposal-go-back").should("not.exist");
  });

  it("should allow 'go back link' navigation to home page tabs", () => {
    const tabs = ["Under Review", "Approved", "Rejected", "Abandoned"];
    for (const tab of tabs) {
      cy.visit(`/?tab=${tab}`);
      cy.wait("@records");
      cy.findAllByTestId("record-card-title-link").first().click();
      cy.findByTestId("proposal-go-back").should("be.visible").click();
      cy.findAllByTestId("record-card-title-link").should("be.visible");
      cy.location("pathname").should("eq", "/");
      cy.location("search").should("eq", `?tab=${encodeURI(tab)}`);
    }
  });

  it("should update page title with proposal name", () => {
    const customName = "Custom Proposal Name";
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 2,
        state: 2,
        customToken,
        name: customName,
      })
    ).as("details");
    cy.visit(`/record/${shortToken}`);
    cy.title().should("include", customName);
  });
});
