import {
  mockTicketvoteSubmissions,
  mockTicketvoteSummaries,
  ticketvoteSummariesByStatus,
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

Cypress.Commands.add(
  "mockProposalDetailsRequests",
  ({
    recordState = 2,
    recordStatus = 2,
    recordReason,
    version = 1,
    voteStatus = "unauthorized",
    piStatus = "under-review",
    billingStatus = 1,
    billingReason,
    linkby,
    linkto,
  } = {}) => {
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: recordStatus,
        state: recordState,
        body,
        username,
        customVersion: version,
        reason: recordReason,
        linkby,
        linkto,
      })
    ).as("details");
    cy.mockResponse(
      "/api/ticketvote/v1/summaries",
      mockTicketvoteSummaries(ticketvoteSummariesByStatus[voteStatus])
    ).as("voteSummaries");
    cy.mockResponse(
      "/api/pi/v1/billingstatuschanges",
      mockPiBillingStatusChanges({
        reason: billingReason,
        status: billingStatus,
      })
    ).as("billing");
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: piStatus })
    ).as("piSummaries");
  }
);

Cypress.Commands.add(
  "mockProposalCommentsRequest",
  ({ amount = 5, additionalComments } = {}) =>
    cy
      .mockResponse(
        "/api/comments/v1/comments",
        mockComments({ amount, additionalComments })
      )
      .as("comments")
);

beforeEach(() => {
  cy.mockProposalCommentsRequest();
  cy.mockProposalDetailsRequests();
});

describe("Given an unauthorized and edited Proposal Details page", () => {
  beforeEach(() => {
    cy.mockProposalDetailsRequests({ version: 2 });
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
    cy.mockProposalDetailsRequests();
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
  it("should render its vote status bar and active status tag", () => {
    cy.mockProposalDetailsRequests({
      voteStatus: "approved",
      piStatus: "active",
    });
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
    cy.mockProposalDetailsRequests({
      voteStatus: "approved",
      piStatus: "closed",
      billingReason: reason,
      billingStatus: 2,
    });
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
    cy.findByTestId("record-card-right-header").should(
      "contain.text",
      "Closed"
    );
    cy.findByTestId("status-change-reason").should("contain.text", reason);
  });
});

describe("Given an abandoned proposal", () => {
  const reason = "Abandon proposal.";
  beforeEach(() => {
    cy.mockProposalDetailsRequests({
      recordStatus: 4,
      recordReason: reason,
      piStatus: "abandoned",
    });
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
    cy.mockProposalDetailsRequests({
      recordStatus: 3,
      recordReason: reason,
      piStatus: "censored",
    });
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
    cy.mockProposalDetailsRequests({
      voteStatus: "approved",
      piStatus: "approved",
      linkby: Date.now() / 1000,
    });
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
    cy.mockProposalDetailsRequests({ linkto: "abcdefghijklmnopq" });
    cy.mockResponse(
      "/api/records/v1/records",
      mockRecordsBatch(mockProposal({ status: 2, state: 2 }))
    ).as("records");
    cy.visit("/record/fake001");
    cy.findByTestId("proposal-rfp-link").should("be.visible");
  });
});

describe("Given a proposal with comments", () => {
  const authorUpdates = [
    {
      extradata: JSON.stringify({
        title: "Author update 1",
      }),
      extradatahint: "proposalupdate",
      parentid: 0,
      username,
      timestamp: Date.now() / 1000 - 300,
    },
    {
      extradata: JSON.stringify({
        title: "Author update 2",
      }),
      extradatahint: "proposalupdate",
      parentid: 0,
      username,
    },
  ];
  beforeEach(() => {
    cy.mockProposalDetailsRequests({
      voteStatus: "approved",
      piStatus: "active",
    });
  });
  describe("when details page view is full", () => {
    it("should display the main comments thread", () => {
      cy.visit("/record/fake001");
      cy.wait(["@details", "@comments"]);
      cy.findAllByTestId("comments-section").should("have.length", 1);
    });
    it("should display author updates on separate threads ordered by timestamp", () => {
      cy.mockProposalCommentsRequest({ additionalComments: authorUpdates });
      cy.visit("/record/fake001");
      cy.wait(["@details", "@comments"]);
      cy.findAllByTestId("comments-section").should("have.length", 3);
      const expectedThreadsTitlesOrder = [
        "Author update 2",
        "Author update 1",
        "Comments",
      ];
      cy.findAllByTestId("comments-section-title").each((thread, i) => {
        expect(thread).to.contain.text(expectedThreadsTitlesOrder[i]);
      });
    });
  });
  describe("when details page view displays only a single thread", () => {
    it("should display only one comments thread", () => {
      cy.visit("/record/fake001/comment/1");
      cy.wait(["@details", "@comments"]);
      cy.findAllByTestId("comments-section").should("have.length", 1);
      cy.findByTestId("comments-view-all-link")
        .should("have.text", "view all comments")
        .invoke("attr", "href")
        .should("eq", "/record/fake001");
    });
    it("should display parent comment preview for reply subthread", () => {
      cy.mockProposalCommentsRequest({
        additionalComments: [{ parentid: 1 }, { parentid: 6 }],
      });
      cy.visit("/record/fake001/comment/6");
      cy.wait(["@details", "@comments"]);
      cy.findAllByTestId("comments-section").should("have.length", 1);
      cy.findAllByTestId("comment-card-parent-preview").should(
        "have.length",
        1
      );
    });
    it("should redirect to full proposal view when clicking on 'view all comments'", () => {
      cy.mockProposalCommentsRequest({ amount: 10 });
      cy.visit("/record/fake001/comment/1");
      cy.wait(["@details", "@comments"]);
      cy.findByTestId("comments-view-all-link").click();
      cy.findAllByTestId("comment-card").should("have.length", 10);
    });
  });
  describe("when comments thread is deep", () => {
    const amount = 1;
    const deepThread = Array(20)
      .fill({ parentid: amount })
      .map((c, i) => ({ parentid: c.parentid + i }));
    beforeEach(() => {
      cy.mockProposalCommentsRequest({
        amount,
        additionalComments: deepThread,
      });
      cy.visit("record/fake001");
      cy.wait(["@details", "@comments"]);
    });
    it("should hide thread on depth == 6", () => {
      cy.findAllByTestId("comment-card").should("have.length", 6);
      cy.findByTestId("comment-card-footer-more-replies")
        .should("include.text", "more reply")
        .invoke("attr", "href")
        .should("eq", "/record/fake001/comment/6");
    });
    it("should display all comments on flat mode", () => {
      cy.findByTestId("comments-filter-flat-mode-button").click();
      cy.findAllByTestId("comment-card").should("have.length", 21);
    });
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
