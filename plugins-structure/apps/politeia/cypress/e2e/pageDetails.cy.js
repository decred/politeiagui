import {
  mockTicketvoteResults,
  mockTicketvoteSubmissions,
  mockTicketvoteSummaries,
} from "@politeiagui/ticketvote/dev/mocks";
import {
  mockPiBillingStatusChanges,
  mockPiSummaries,
  mockProposal,
  mockProposalDetails,
} from "../../src/pi/dev/mocks";
import {
  mockComments,
  mockCommentsCount,
} from "@politeiagui/comments/dev/mocks";
import { mockRecordsBatch } from "@politeiagui/core/dev/mocks";

const body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const username = "FakeTester";
const approvedVoteSummary = {
  type: 1,
  status: 5,
  duration: 10,
  startblockheight: 883357,
  startblockhash:
    "0000000094f39c5495faad40a6554f6996c9912d378afa19b971055ebe505382",
  endblockheight: 883374,
  eligibletickets: 5589,
  quorumpercentage: 0,
  passpercentage: 60,
  results: [
    { id: "yes", votes: 500 },
    { id: "no", votes: 50 },
  ],
  bestblock: 956278,
};

beforeEach(() => {
  cy.mockResponse("/api/comments/v1/comments", mockComments({ amount: 5 })).as(
    "comments"
  );
  cy.mockResponse(
    "/api/records/v1/details",
    mockProposalDetails({
      status: 2,
      state: 2,
      body,
      username,
      customVersion: 2,
    })
  ).as("details");
  cy.mockResponse(
    "/api/ticketvote/v1/summaries",
    mockTicketvoteSummaries({ status: 1 })
  ).as("voteSummaries");
  cy.mockResponse("/api/pi/v1/summaries", mockPiSummaries()).as("piSummaries");
});

describe("Given an unauthorized and edited Proposal Details page", () => {
  beforeEach(() => {
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should render proposal details page elements", () => {
    cy.findByTestId("proposal-body").should("have.text", body);
    cy.findByTestId("proposal-username").should("have.text", username);
    cy.findByTestId("proposal-version").should("have.text", "version 2");
    cy.findByTestId("record-card-title").should("be.visible");
    // Edited proposal should have published and edited timestamps
    cy.findByTestId("proposal-date-published").should("be.visible");
    cy.findByTestId("proposal-date-edited").should("be.visible");
    cy.findByTestId("proposal-metadata").should("be.visible");
    cy.findByTestId("proposal-downloads").should("be.visible");
    // Full token is displayed
    cy.findByTestId("record-token").should("contain.text", "fake001");
    // Status tag corresponds to its unauthorized voteSummary status
    cy.findByTestId("record-card-right-header").should(
      "have.text",
      "Waiting for author to authorize voting"
    );
    // Load comments correctly
    cy.findAllByTestId("comment-card").should("have.length", 5);
  });
  it("should open the diff modal when clicking on some different proposal version", () => {
    cy.findByTestId("proposal-version")
      .click()
      .should("include.text", "version 1");
    cy.findByTestId("proposal-version").findByText("version 1").click();
    cy.findByTestId("modal-proposal-diff").should("be.visible");
  });
});

describe("Given an unauthorized and unedited Proposal Details page", () => {
  beforeEach(() => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 2,
        state: 2,
        body,
        username,
      })
    ).as("details");
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should render proposal details page elements except version and edit event", () => {
    // For first versions, show only published date
    cy.findByTestId("proposal-version").should("not.exist");
    cy.findByTestId("proposal-date-edited").should("not.exist");
    cy.findByTestId("proposal-date-published").should("be.visible");
    // Other elements should be displayed as well.
    cy.findByTestId("proposal-body").should("have.text", body);
    cy.findByTestId("proposal-username").should("have.text", username);
    cy.findByTestId("record-card-title").should("be.visible");
    cy.findByTestId("proposal-metadata").should("be.visible");
    cy.findByTestId("proposal-downloads").should("be.visible");
    cy.findByTestId("record-token").should("contain.text", "fake001");
    cy.findByTestId("record-card-right-header").should(
      "have.text",
      "Waiting for author to authorize voting"
    );
    cy.findAllByTestId("comment-card").should("have.length", 5);
  });
});

describe("Given an approved proposal details page", () => {
  beforeEach(() => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 2,
        state: 2,
        body,
        username,
      })
    ).as("details");
    cy.mockResponse(
      "/api/pi/v1/billingstatuschanges",
      mockPiBillingStatusChanges()
    ).as("billing");
    cy.mockResponse(
      "/api/ticketvote/v1/summaries",
      mockTicketvoteSummaries(approvedVoteSummary)
    ).as("voteSummaries");
  });
  it("should render its vote status bar and active status tag", () => {
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: "active" })
    ).as("piSummaries");
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
    cy.findByTestId("record-card-right-header").should(
      "contain.text",
      "Active"
    );
    cy.findByTestId("ticketvote-vote-status-bar").should("be.visible");
    // Other elements should be displayed as well.
    cy.findByTestId("proposal-body").should("have.text", body);
    cy.findByTestId("proposal-username").should("have.text", username);
    cy.findByTestId("record-card-title").should("be.visible");
    cy.findByTestId("proposal-metadata").should("be.visible");
    cy.findByTestId("proposal-downloads").should("be.visible");
    cy.findByTestId("record-token").should("contain.text", "fake001");
    cy.findAllByTestId("comment-card").should("have.length", 5);
  });
  it("should render status changes reason for closed billing", () => {
    const reason = "Closed!";
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: "closed" })
    ).as("piSummaries");
    cy.mockResponse(
      "/api/pi/v1/billingstatuschanges",
      mockPiBillingStatusChanges({ status: 2, reason })
    );
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
    cy.findByTestId("record-card-right-header").should(
      "contain.text",
      "Closed"
    );
    cy.findByTestId("status-change-reason").should("contain.text", reason);
  });
  it("should allow votes search by ticket token", () => {
    const ticket = "fakeTicketToken";
    cy.mockResponse(
      "/api/ticketvote/v1/results",
      mockTicketvoteResults({ yes: 500, no: 50, result: { ticket } })
    ).as("results");
    cy.visit("/record/fake001");
    cy.findByTestId("proposal-search-votes-button").click();
    cy.wait("@results");
    cy.findByTestId("ticketvote-modal-ticket-search-input")
      .type(ticket)
      .type("{enter}");
    cy.findByTestId("ticketvote-modal-ticket-search-table").should("exist");
  });
});

describe("Given an abandoned proposal", () => {
  const reason = "Abandon proposal.";
  beforeEach(() => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 4,
        state: 2,
        body,
        username,
        reason,
      })
    ).as("details");
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: "abandoned" })
    ).as("piSummaries");
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should render abandonment reason", () => {
    cy.findByTestId("status-change-reason").should("contain.text", reason);
  });
  it("should render proposal body", () => {
    cy.findByTestId("proposal-body").should("contain.text", body);
  });
});

describe("Given a censored proposal", () => {
  const reason = "Censor proposal.";
  beforeEach(() => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 3,
        state: 2,
        body,
        username,
        reason,
      })
    ).as("details");
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: "censored" })
    ).as("piSummaries");
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should render censorship reason", () => {
    cy.findByTestId("status-change-reason").should("contain.text", reason);
  });
  it("should not render proposal body and title", () => {
    cy.findByTestId("proposal-body").should("have.text", "");
    cy.findByTestId("record-card-title").should("have.text", "fake001");
  });
});

describe("Given an RFP Proposal", () => {
  beforeEach(() => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        state: 2,
        status: 2,
        body,
        username,
        linkby: Date.now() / 1000,
      })
    ).as("details");
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: "approved" })
    ).as("piSummaries");
    cy.mockResponse(
      "/api/ticketvote/v1/summaries",
      mockTicketvoteSummaries(approvedVoteSummary)
    ).as("voteSummaries");
    cy.mockResponse(
      "/api/ticketvote/v1/submissions",
      mockTicketvoteSubmissions(4)
    ).as("submissions");
    cy.mockResponse("/api/comments/v1/count", mockCommentsCount()).as("counts");
    cy.mockResponse(
      "/api/records/v1/records",
      mockRecordsBatch(mockProposal({ status: 2, state: 2 }))
    ).as("records");
  });
  it("should load RFP Tag", () => {
    cy.visit("/record/fake001");
    cy.wait([
      "@details",
      "@comments",
      "@voteSummaries",
      "@piSummaries",
      "@submissions",
    ]);
    cy.findByTestId("proposal-rfp-tag").should("be.visible");
  });
  it("should load RFP Submissions list", () => {
    cy.visit("/record/fake001");
    cy.wait([
      "@details",
      "@comments",
      "@voteSummaries",
      "@piSummaries",
      "@submissions",
    ]);
    cy.findByText(/submitted proposals/i).should("be.visible");
    cy.findAllByTestId("record-item").should("have.length", 4);
  });
  it("should render all RFP submissions despite list length", () => {
    cy.mockResponse(
      "/api/ticketvote/v1/submissions",
      mockTicketvoteSubmissions(20)
    ).as("submissions");
    cy.visit("/record/fake001");
    cy.wait([
      "@details",
      "@comments",
      "@voteSummaries",
      "@piSummaries",
      "@submissions",
    ]);
    cy.findByText(/submitted proposals/i).should("be.visible");
    cy.findAllByTestId("record-item").should("have.length", 20);
    cy.get("@records.all").should("have.length", 4);
  });
});

describe("Given an RFP submission", () => {
  it("should load its linked RFP Proposal title", () => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        state: 2,
        status: 2,
        linkto: "abcdefghijlmnopq",
      })
    ).as("details");
    cy.mockResponse(
      "/api/records/v1/records",
      mockRecordsBatch(mockProposal({ status: 2, state: 2 }))
    ).as("records");
    cy.visit("/record/fake001");
    cy.findByTestId("proposal-rfp-link").should("be.visible");
  });
});

describe("Given requests errors on Details page", () => {
  function errorMock() {
    return {
      errorcode: 1658261424,
    };
  }
  it("should diplay error message when details request fails", () => {
    cy.mockResponse("/api/records/v1/details", errorMock, { statusCode: 500 });
    cy.visit("/record/1234567");
    cy.findByTestId("proposal-details-error").should(
      "include.text",
      "1658261424"
    );
  });
  it("should diplay error message when vote summaries request fails", () => {
    cy.mockResponse("/api/ticketvote/v1/summaries", errorMock, {
      statusCode: 500,
    });
    cy.visit("/record/1234567");
    cy.findByTestId("proposal-details-error").should(
      "include.text",
      "1658261424"
    );
  });
  it("should diplay error message when comments request fails", () => {
    cy.mockResponse("/api/comments/v1/comments", errorMock, {
      statusCode: 500,
    });
    cy.visit("/record/1234567");
    cy.findByTestId("proposal-details-error").should(
      "include.text",
      "1658261424"
    );
  });
});
