import { mockTicketvoteSummaries } from "@politeiagui/ticketvote/dev/mocks";
import { mockPiSummaries, mockProposalDetails } from "../../src/pi/dev/mocks";
import { mockComments } from "@politeiagui/comments/dev/mocks";

const body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const username = "FakeTester";

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
      "/api/ticketvote/v1/summaries",
      mockTicketvoteSummaries({
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
      })
    ).as("voteSummaries");
    cy.mockResponse(
      "/api/pi/v1/summaries",
      mockPiSummaries({ status: "active" })
    ).as("piSummaries");
    cy.visit("/record/fake001");
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should render its vote status bar and active status tag", () => {
    cy.findByTestId("record-card-right-header").should("have.text", "Active");
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
