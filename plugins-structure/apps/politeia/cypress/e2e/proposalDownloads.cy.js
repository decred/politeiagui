import {
  mockTicketvotePolicy,
  mockTicketvoteSummaries,
  mockTicketvoteTimestamps,
} from "@politeiagui/ticketvote/dev/mocks";
import {
  mockPiBillingStatusChanges,
  mockPiSummaries,
  mockProposalDetails,
} from "../../src/pi/dev/mocks";
import {
  mockComments,
  mockCommentsPolicy,
  mockCommentsTimestamps,
} from "@politeiagui/comments/dev/mocks";
import { mockRecordTimestamps } from "@politeiagui/core/dev/mocks";
import path from "path";

const yesVotes = 250;
const noVotes = 50;
const timestampspagesize = 100;
const customVersion = 2;

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
    { id: "yes", votes: yesVotes },
    { id: "no", votes: noVotes },
  ],
  bestblock: 956278,
};

const downloadsFolder = Cypress.config("downloadsFolder");
const customToken = "fake001234567891";

beforeEach(() => {
  cy.mockResponse(
    "/api/comments/v1/policy",
    mockCommentsPolicy({ timestampspagesize })
  );
  cy.mockResponse(
    "/api/ticketvote/v1/policy",
    mockTicketvotePolicy({ timestampspagesize })
  );
  cy.mockResponse("/api/comments/v1/comments", mockComments({ amount: 5 })).as(
    "comments"
  );
  cy.mockResponse(
    "/api/records/v1/details",
    mockProposalDetails({
      status: 2,
      state: 2,
      customToken: "fake001234567891",
      customVersion,
    })
  ).as("details");
  cy.mockResponse(
    "/api/ticketvote/v1/summaries",
    mockTicketvoteSummaries(approvedVoteSummary)
  ).as("voteSummaries");
  cy.mockResponse(
    "/api/pi/v1/summaries",
    mockPiSummaries({ status: "active" })
  ).as("piSummaries");
  cy.mockResponse(
    "/api/pi/v1/billingstatuschanges",
    mockPiBillingStatusChanges()
  ).as("billing");
  // Mock timestamps
  cy.mockResponse(
    "/api/ticketvote/v1/timestamps",
    mockTicketvoteTimestamps()
  ).as("votesTimestamps");
  cy.mockResponse("/api/comments/v1/timestamps", mockCommentsTimestamps()).as(
    "commentsTimestamps"
  );
  cy.mockResponse("/api/records/v1/timestamps", mockRecordTimestamps()).as(
    "recordTimestamps"
  );
});

describe("Given a proposal with votes", () => {
  beforeEach(() => {
    // Load page
    cy.visit(`/record/${customToken.substring(0, 7)}`);
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should download all votes timestamps", () => {
    const expectedRequestsAmount =
      Math.ceil((yesVotes + noVotes) / timestampspagesize) + 1;
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-votes-timestamps").click();
    cy.wait(Array(expectedRequestsAmount).fill("@votesTimestamps"));
    cy.get("@votesTimestamps.all").should(
      "have.length",
      expectedRequestsAmount
    );
    // All votes timestamps were downloaded
    cy.readFile(
      path.join(downloadsFolder, `${customToken}-vote-timestamps.json`)
    )
      .should("exist")
      .should("have.keys", ["auths", "votes", "details"])
      .its("votes")
      .should("have.length", yesVotes + noVotes);
  });
  it("should download votes bundle", () => {
    // TODO: TEST CASE
  });
  it("should display progress bar when download is in progress", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-votes-timestamps").click();
    cy.wait("@votesTimestamps");
    cy.findByTestId("common-ui-progress-bar", { timeout: 10000 }).should(
      "be.visible"
    );
  });
});

describe("Given a proposal with comments", () => {
  const amount = 300;
  beforeEach(() => {
    cy.mockResponse("/api/comments/v1/comments", mockComments({ amount })).as(
      "comments"
    );
    // Load page
    cy.visit(`/record/${customToken.substring(0, 7)}`);
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should download all coments timestamps", () => {
    const expectedRequestsAmount = Math.ceil(amount / timestampspagesize);
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-comments-timestamps").click();
    cy.wait(Array(expectedRequestsAmount).fill("@commentsTimestamps"));
    cy.get("@commentsTimestamps.all").should(
      "have.length",
      expectedRequestsAmount
    );
    // All comments timestamps were fetched
    cy.readFile(
      path.join(downloadsFolder, `${customToken}-comments-timestamps.json`)
    )
      .should("exist")
      .should(
        "have.keys",
        Array(amount)
          .fill("")
          .map((_, i) => `${i + 1}`)
      );
  });
  it("should display progress bar when download is in progress", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-comments-timestamps").click();
    cy.wait("@commentsTimestamps");
    cy.findByTestId("common-ui-progress-bar", { timeout: 10000 }).should(
      "be.visible"
    );
  });
});

describe("Given a proposal with record data", () => {
  beforeEach(() => {
    // Load page
    cy.visit(`/record/${customToken.substring(0, 7)}`);
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should download record timestamps", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-record-timestamps").click();
    cy.wait("@recordTimestamps");
    cy.readFile(
      path.join(
        downloadsFolder,
        `${customToken}-v${customVersion}-record-timestamps.json`
      )
    )
      .should("exist")
      .should("have.keys", ["recordmetadata", "metadata", "files"]);
  });
});
