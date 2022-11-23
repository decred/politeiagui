import {
  mockTicketvoteDetails,
  mockTicketvoteInventory,
  mockTicketvotePolicy,
  mockTicketvoteResults,
  mockTicketvoteSummaries,
  mockTicketvoteTimestamps,
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
  mockCommentsPolicy,
  mockCommentsTimestamps,
} from "@politeiagui/comments/dev/mocks";
import {
  mockRecordTimestamps,
  mockRecordsBatch,
  recordToken,
} from "@politeiagui/core/dev/mocks";
import path from "path";

const yesVotes = 650;
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
      customToken,
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
  // Mock bundle requests
  cy.mockResponse(
    "/api/ticketvote/v1/results",
    mockTicketvoteResults({ yes: yesVotes, no: noVotes })
  ).as("voteResults");
  cy.mockResponse("/api/ticketvote/v1/details", mockTicketvoteDetails()).as(
    "voteDetails"
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
      path.join(downloadsFolder, `${customToken}-votes-timestamps.json`)
    )
      .should("exist")
      .should("have.keys", ["auths", "votes", "details"])
      .its("votes")
      .should("have.length", yesVotes + noVotes);
  });
  it("should download votes bundle", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-votes-bundle").click();
    cy.wait(["@voteDetails", "@voteResults"]);
    cy.readFile(path.join(downloadsFolder, `${customToken}-votes-bundle.json`))
      .should("exist")
      .should("have.keys", ["auths", "votes", "vote"])
      .its("votes")
      .should("have.length", yesVotes + noVotes);
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
  const amount = 100;
  const timestampspagesize = 10;
  beforeEach(() => {
    // Change page size so we can dispatch multiple requests without increasing
    // the comments number.
    cy.mockResponse(
      "/api/comments/v1/policy",
      mockCommentsPolicy({ timestampspagesize })
    );

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
  it("should download comments bundle", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-comments-bundle").click();
    cy.readFile(
      path.join(downloadsFolder, `${customToken}-comments-bundle.json`)
    )
      .should("exist")
      .should("have.length", amount);
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
  it("should download record bundle", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-record-bundle").click();
    cy.readFile(
      path.join(
        downloadsFolder,
        `${customToken}-v${customVersion}-record-bundle.json`
      )
    )
      .should("exist")
      .should("have.keys", [
        "state",
        "status",
        "version",
        "timestamp",
        "username",
        "metadata",
        "files",
        "censorshiprecord",
      ]);
  });
});

describe("Given some download in progress", () => {
  const amount = 60;
  const newToken = recordToken();
  const timestampspagesize = 10;
  beforeEach(() => {
    // Change page size so we can dispatch multiple requests without increasing
    // the comments number.
    cy.mockResponse(
      "/api/comments/v1/policy",
      mockCommentsPolicy({ timestampspagesize })
    );
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 2,
        state: 2,
        customToken: newToken,
        customVersion,
      })
    ).as("details");
    // Mock requests for home page
    cy.mockResponse("/api/ticketvote/v1/inventory", mockTicketvoteInventory(3));
    cy.mockResponse(
      "/api/records/v1/records",
      mockRecordsBatch(mockProposal({ state: 2, status: 2 }))
    ).as("records");
    cy.mockResponse("/api/comments/v1/comments", mockComments({ amount })).as(
      "comments"
    );
    cy.mockResponse("/api/comments/v1/timestamps", mockCommentsTimestamps(), {
      delay: 1000,
    }).as("commentsTimestamps");
    cy.mockResponse("/api/comments/v1/count", mockCommentsCount()).as("counts");
    // Visit proposal details page
    cy.visit(`/record/${newToken.substring(0, 7)}`);
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should continue votes downloads on route change", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-votes-timestamps").click();
    // Navigate to app using app links
    cy.findByTestId("politeia-logo").click();
    cy.findByTestId("common-ui-progress-bar", { timeout: 10000 }).should(
      "be.visible"
    );
    // Requests should continue on background
    cy.wait("@votesTimestamps");
    cy.readFile(path.join(downloadsFolder, `${newToken}-votes-timestamps.json`))
      .should("exist")
      .should("have.keys", ["auths", "votes", "details"])
      .its("votes")
      .should("have.length", yesVotes + noVotes);
  });
  it("should continue comments downloads on route change", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-comments-timestamps").click();
    // Navigate to app using app links
    cy.findByTestId("politeia-logo").click();
    cy.findByTestId("common-ui-progress-bar", { timeout: 10000 }).should(
      "be.visible"
    );
    // Requests should continue on background
    cy.wait("@commentsTimestamps");
    // All comments timestamps were fetched
    cy.readFile(
      path.join(downloadsFolder, `${newToken}-comments-timestamps.json`)
    )
      .should("exist")
      .should(
        "have.keys",
        Array(amount)
          .fill("")
          .map((_, i) => `${i + 1}`)
      );
  });
});

describe("Given some failed download", () => {
  const failedToken = recordToken();
  const amount = 20;
  const timestampspagesize = 5;
  const errorFn = () => ({
    errorcode: 123123123,
  });
  beforeEach(() => {
    cy.mockResponse("/api/comments/v1/comments", mockComments({ amount })).as(
      "comments"
    );
    cy.mockResponse(
      "/api/comments/v1/policy",
      mockCommentsPolicy({ timestampspagesize })
    );
    cy.mockResponse(
      "/api/records/v1/details",
      mockProposalDetails({
        status: 2,
        state: 2,
        customToken: failedToken,
        customVersion,
      })
    ).as("details");
    // Vote Timestamps error
    cy.mockResponse("/api/ticketvote/v1/timestamps", errorFn, {
      statusCode: 500,
    }).as("votesTimestamps");
    cy.mockResponse(
      { url: "/api/ticketvote/v1/timestamps", times: 2 },
      mockTicketvoteTimestamps()
    ).as("votesTimestamps");
    // Comments timestamps error
    cy.mockResponse("/api/comments/v1/timestamps", errorFn, {
      statusCode: 500,
      delay: 300,
    }).as("commentsTimestamps");
    // Records timestamps error
    cy.mockResponse("/api/records/v1/timestamps", errorFn, {
      statusCode: 500,
    }).as("recordTimestamps");
    // Votes bundle error
    cy.mockResponse("/api/ticketvote/v1/details", errorFn, {
      statusCode: 500,
    }).as("voteDetails");
    // Visit page
    cy.visit(`/record/${failedToken.substring(0, 7)}`);
    cy.wait(["@details", "@comments", "@voteSummaries", "@piSummaries"]);
  });
  it("should cancel votes timestamps downloads", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-votes-timestamps").click();
    // Assert download canceled
    cy.readFile(
      path.join(downloadsFolder, `${failedToken}-votes-timestamps.json`)
    ).should("not.exist");
    cy.findByTestId("common-ui-toast").should("be.visible");
  });
  it("should cancel votes bundle downloads", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-votes-bundle").click();
    // Assert download canceled
    cy.readFile(
      path.join(downloadsFolder, `${failedToken}-votes-bundle.json`)
    ).should("not.exist");
    cy.findByTestId("common-ui-toast").should("be.visible");
  });
  it("should cancel comments timestamps downloads", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-comments-timestamps").click();
    // Assert download canceled
    cy.readFile(
      path.join(downloadsFolder, `${failedToken}-comments-timestamps.json`)
    ).should("not.exist");
    cy.findByTestId("common-ui-toast").should("be.visible");
  });
  it("should cancel record timestamps downloads", () => {
    cy.findByTestId("proposal-downloads").click();
    cy.findByTestId("proposal-downloads-record-timestamps").click();
    // Assert download canceled
    cy.readFile(
      path.join(
        downloadsFolder,
        `${failedToken}-record-v${customVersion}-timestamps.json`
      )
    ).should("not.exist");
    cy.findByTestId("common-ui-toast").should("be.visible");
  });
});
