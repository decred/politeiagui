import {
  mockTicketvoteInventory,
  mockTicketvoteSummaries,
} from "@politeiagui/ticketvote/dev/mocks";
import { mockCommentsCount } from "@politeiagui/comments/dev/mocks";
import { mockRecordsBatch } from "@politeiagui/core/dev/mocks";
import {
  mockPiBillingStatusChanges,
  mockPiSummaries,
  mockProposal,
} from "../../src/pi/dev/mocks";

Cypress.Commands.add("assertProposalsListLength", (length) =>
  cy.findAllByTestId("proposal-card").should("have.length", length)
);

Cypress.Commands.add("mockInventory", (amount, matcherParams = {}) =>
  cy.mockResponse(
    { url: "/api/ticketvote/v1/inventory", ...matcherParams },
    mockTicketvoteInventory(amount)
  )
);

Cypress.Commands.add("mockVoteSummaries", (status, matcherParams = {}) =>
  cy.mockResponse(
    { url: "/api/ticketvote/v1/summaries", ...matcherParams },
    mockTicketvoteSummaries({ status })
  )
);

Cypress.Commands.add("mockPiSummaries", (status, matcherParams = {}) =>
  cy.mockResponse(
    { url: "/api/pi/v1/summaries", ...matcherParams },
    mockPiSummaries({ status })
  )
);

// Mock comments counts, ticketvote summaries and records, with aliases.
beforeEach(() => {
  cy.mockResponse("/api/comments/v1/count", mockCommentsCount()).as("counts");
  // considering all proposals are public on home page.
  cy.mockResponse(
    "/api/records/v1/records",
    mockRecordsBatch(mockProposal({ state: 2, status: 2 }))
  ).as("records");
  cy.mockVoteSummaries().as("summaries");
  cy.mockPiSummaries().as("piSummaries");
  cy.mockResponse(
    "/api/pi/v1/billingstatuschanges",
    mockPiBillingStatusChanges()
  ).as("billingstatuschanges");
});

describe("Given Home page presentation", () => {
  describe("when page loads", () => {
    it("should render page tabs, sidebar and navbar for xl screens", () => {
      cy.mockInventory(0);
      cy.viewport(1200, 1200);
      cy.visit("/");
      cy.findByTestId("about-politeia").should("be.visible");
      cy.findByTestId("common-ui-navbar").should("be.visible");
      cy.findByTestId("common-ui-page-banner").should("be.visible");
    });
  });
  describe("when inventory is empty", () => {
    it("should render 'empty proposals' message", () => {
      cy.mockInventory(0);
      cy.visit("/");
      cy.findByTestId("home-empty-list").should("exist");
    });
  });
  describe("when switching tabs", () => {
    it("should render first batch on tab switch", () => {
      cy.mockInventory(0).as("inventory");
      cy.visit("/");
      // Wait until all inventory requests are done
      cy.wait(["@inventory", "@inventory", "@inventory"]);
      // Mock inventory response so it's not empty
      cy.mockInventory(5).as("inventory");
      // Navigate to Approved tab
      cy.findByTestId("tab-1").click();
      cy.wait("@records");
      cy.assertProposalsListLength(5);
      // Rejected
      cy.findByTestId("tab-2").click();
      cy.wait("@records");
      cy.assertProposalsListLength(5);
      // Abandoned
      cy.findByTestId("tab-3").click();
      cy.wait("@records");
      cy.assertProposalsListLength(5);
      // switch tabs without fetching
      cy.findByTestId("tab-1").click();
      cy.findByTestId("tab-2").click();
      cy.findByTestId("tab-3").click();
      // no new inventory and record calls.
      // 3 from under review, and 1 from each approved, rejected and abandoned.
      cy.get("@inventory.all").its("length").should("eq", 6);
      // 1 record call from each approved, rejected and abandoned. No calls from
      // empty under review tab
      cy.get("@records.all").its("length").should("eq", 3);
    });
  });

  describe("when navivating to tab using url query params", () => {
    beforeEach(() => {
      cy.mockInventory(0).as("inventory");
    });
    it("should load Under Review tab", () => {
      cy.visit("/?tab=Under Review");
      cy.wait(["@inventory", "@inventory", "@inventory"]);
      cy.get("@inventory.all").should("have.length", 3);
      cy.findByText("No proposals under review").should("be.visible");
    });
    it("should load Approved tab", () => {
      cy.visit("/?tab=Approved");
      cy.wait("@inventory");
      cy.get("@inventory.all").should("have.length", 1);
      cy.findByText("No proposals approved").should("be.visible");
    });
    it("should load Rejected tab", () => {
      cy.visit("/?tab=Rejected");
      cy.wait("@inventory");
      cy.get("@inventory.all").should("have.length", 1);
      cy.findByText("No proposals rejected").should("be.visible");
    });
    it("should load Abandoned tab", () => {
      cy.visit("/?tab=Abandoned");
      cy.wait("@inventory");
      cy.get("@inventory.all").should("have.length", 1);
      cy.findByText("No proposals abandoned").should("be.visible");
    });
  });
});

describe("Given Home Under Review tab", () => {
  describe("when there are 25 proposals of each status", () => {
    it("should load all proposals from list", () => {
      // Orders are reverse due to intercept stack behavior (FILO).
      // 25 Unauthorized.
      cy.mockVoteSummaries(1).as("summaries");
      cy.mockPiSummaries("under-review").as("piSummaries");
      cy.mockInventory(5).as("unauthorized");
      cy.mockInventory(20, { times: 1 }).as("unauthorized");
      // 25 Authorized.
      cy.mockVoteSummaries(2, { times: 5 }).as("summaries");
      cy.mockPiSummaries("vote-authorized", { times: 5 }).as("piSummaries");
      cy.mockInventory(5, { times: 1 }).as("authorized");
      cy.mockInventory(20, { times: 1 }).as("authorized");
      // 25 Started.
      cy.mockVoteSummaries(3, { times: 5 }).as("summaries");
      cy.mockPiSummaries("vote-started", { times: 5 }).as("piSummaries");
      cy.mockInventory(5, { times: 1 }).as("started");
      cy.mockInventory(20, { times: 1 }).as("started");
      // Begin tests.
      cy.visit("/");
      cy.wait("@started");
      // Keep scrolling until list gets fully fetched
      cy.wrap(Array(50)).each(() => {
        cy.findAllByTestId("proposal-card").last().scrollIntoView({
          easing: "linear",
          duration: 200,
        });
      });
      // Assert all inventory requests. 2 of each status.
      cy.get("@started.all").should("have.length", 2);
      cy.get("@authorized.all").should("have.length", 2);
      cy.get("@unauthorized.all").should("have.length", 2);
      // 5 records and summaries calls for each status.
      cy.get("@records.all").should("have.length", 15);
      cy.get("@summaries.all").should("have.length", 15);
      cy.get("@piSummaries.all").should("have.length", 15);
      // 3 comments counts calls for each status.
      cy.get("@counts.all").should("have.length", 9);
      // 75 proposals cards displayed.
      cy.assertProposalsListLength(75);
    });
  });
  describe("when there are 10 proposals of each status", () => {
    it("should load all proposals from list", () => {
      // Orders are reverse due to intercept stack behavior (FILO).
      // 10 Unauthorized.
      cy.mockVoteSummaries(1).as("summaries");
      cy.mockPiSummaries("under-review").as("piSummaries");
      cy.mockInventory(10).as("unauthorized");
      // 10 Authorized.
      cy.mockVoteSummaries(2, { times: 2 }).as("summaries");
      cy.mockPiSummaries("vote-authorized", { times: 1 }).as("piSummaries");
      cy.mockInventory(10, { times: 1 }).as("authorized");
      // 10 Started.
      cy.mockVoteSummaries(3, { times: 2 }).as("summaries");
      cy.mockPiSummaries("vote-started", { times: 2 }).as("piSummaries");
      cy.mockInventory(10, { times: 1 }).as("started");
      // Begin tests.
      cy.visit("/");
      cy.wait("@started");
      cy.wrap(Array(20)).each(() => {
        cy.findAllByTestId("proposal-card").last().scrollIntoView({
          easing: "linear",
          duration: 200,
        });
      });

      cy.get("@started.all").should("have.length", 1);
      cy.get("@authorized.all").should("have.length", 1);
      cy.get("@unauthorized.all").should("have.length", 1);

      cy.get("@records.all").should("have.length", 6);
      cy.get("@summaries.all").should("have.length", 6);
      cy.get("@piSummaries.all").should("have.length", 6);

      cy.get("@counts.all").should("have.length", 3);

      cy.assertProposalsListLength(30);
    });
  });
  describe("when 0 started, 25 authorized, 25 unauthorized", () => {
    it("should load all proposals from list", () => {
      // Orders are reverse due to intercept stack behavior (FILO).
      // 25 Unauthorized.
      cy.mockVoteSummaries(1).as("summaries");
      cy.mockPiSummaries("under-review").as("piSummaries");
      cy.mockInventory(5).as("unauthorized");
      cy.mockInventory(20, { times: 1 }).as("unauthorized");
      // 25 Authorized.
      cy.mockVoteSummaries(2, { times: 5 }).as("summaries");
      cy.mockPiSummaries("vote-authorized", { times: 5 }).as("piSummaries");
      cy.mockInventory(5, { times: 1 }).as("authorized");
      cy.mockInventory(20, { times: 1 }).as("authorized");
      // 0 Started.
      cy.mockInventory(0, { times: 1 }).as("started");
      // Begin tests.
      cy.visit("/");
      cy.wait("@started");
      cy.wrap(Array(40)).each(() => {
        cy.findAllByTestId("proposal-card").last().scrollIntoView({
          easing: "linear",
          duration: 200,
        });
      });

      cy.get("@started.all").should("have.length", 1);
      cy.get("@authorized.all").should("have.length", 2);
      cy.get("@unauthorized.all").should("have.length", 2);

      cy.get("@records.all").should("have.length", 10);
      cy.get("@summaries.all").should("have.length", 10);
      cy.get("@piSummaries.all").should("have.length", 10);

      cy.get("@counts.all").should("have.length", 6);

      cy.assertProposalsListLength(50);
    });
  });
  describe("when 0 started, 10 authorized, 25 unauthorized", () => {
    it("should load all proposals from list", () => {
      // 25 Unauthorized.
      cy.mockVoteSummaries(1).as("summaries");
      cy.mockInventory(5).as("unauthorized");
      cy.mockInventory(20, { times: 1 }).as("unauthorized");
      // 10 Authorized.
      cy.mockVoteSummaries(2, { times: 2 }).as("summaries");
      cy.mockPiSummaries("vote-authorized", { times: 2 }).as("piSummaries");
      cy.mockInventory(10, { times: 1 }).as("authorized");
      // 0 Started.
      cy.mockInventory(0, { times: 1 }).as("started");
      // Begin tests.
      cy.visit("/");
      cy.wait("@started");
      cy.wrap(Array(20)).each(() => {
        cy.findAllByTestId("proposal-card").last().scrollIntoView({
          easing: "linear",
          duration: 200,
        });
      });

      cy.get("@started.all").should("have.length", 1);
      cy.get("@authorized.all").should("have.length", 1);
      cy.get("@unauthorized.all").should("have.length", 2);

      cy.get("@records.all").should("have.length", 7);
      cy.get("@summaries.all").should("have.length", 7);
      cy.get("@piSummaries.all").should("have.length", 7);

      cy.get("@counts.all").should("have.length", 4);

      cy.assertProposalsListLength(35);
    });
  });
  describe("when 0 started, 0 authorized, 25 unauthorized", () => {
    it("should load all proposals from list", () => {
      // Orders are reverse due to intercept stack behavior (FILO).
      // 5 Unauthorized.
      cy.mockVoteSummaries(1).as("summaries");
      cy.mockInventory(5).as("unauthorized");
      cy.mockInventory(20, { times: 1 }).as("unauthorized");
      // 0 Authorized.
      cy.mockInventory(0, { times: 1 }).as("authorized");
      // 0 Started.
      cy.mockInventory(0, { times: 1 }).as("started");
      // Begin tests.
      cy.visit("/");
      cy.wait("@started");
      cy.wrap(Array(15)).each(() => {
        cy.findAllByTestId("proposal-card").last().scrollIntoView({
          easing: "linear",
          duration: 200,
        });
      });

      cy.get("@started.all").should("have.length", 1);
      cy.get("@authorized.all").should("have.length", 1);
      cy.get("@unauthorized.all").should("have.length", 2);

      cy.get("@records.all").should("have.length", 5);
      cy.get("@summaries.all").should("have.length", 5);

      cy.get("@counts.all").should("have.length", 3);

      cy.assertProposalsListLength(25);
    });
  });
  describe("when 0 started, 0 authorized, 10 unauthorized", () => {
    it("should load all proposals from list", () => {
      // Orders are reverse due to intercept stack behavior (FILO).
      // 10 Unauthorized.
      cy.mockVoteSummaries(1).as("summaries");
      cy.mockInventory(10).as("unauthorized");
      // 0 Authorized.
      cy.mockInventory(0, { times: 1 }).as("authorized");
      // 0 Started.
      cy.mockInventory(0, { times: 1 }).as("started");
      // Begin tests.
      cy.visit("/");
      cy.wait("@started");
      cy.wrap(Array(10)).each(() => {
        cy.findAllByTestId("proposal-card").last().scrollIntoView({
          easing: "linear",
          duration: 200,
        });
      });

      cy.get("@started.all").should("have.length", 1);
      cy.get("@authorized.all").should("have.length", 1);
      cy.get("@unauthorized.all").should("have.length", 1);

      cy.get("@records.all").should("have.length", 2);
      cy.get("@summaries.all").should("have.length", 2);

      cy.get("@counts.all").should("have.length", 1);

      cy.assertProposalsListLength(10);
    });
  });
});

describe("Given Home single status tab (approved, rejected or abandoned)", () => {
  beforeEach(() => {
    cy.mockInventory(5).as("inventory");
    cy.mockInventory(20, { times: 1 }).as("inventory");
  });
  afterEach(() => {
    cy.wrap(Array(15)).each(() => {
      cy.findAllByTestId("proposal-card").last().scrollIntoView({
        easing: "linear",
        duration: 200,
      });
    });
    cy.get("@records.all").should("have.length", 5);
    cy.get("@summaries.all").should("have.length", 5);
    cy.get("@counts.all").should("have.length", 3);
    cy.assertProposalsListLength(25);
  });
  describe("when on Approved tab", () => {
    it("should render all Approved proposals", () => {
      cy.mockVoteSummaries(5).as("summaries");
      cy.mockResponse(
        { url: "/api/pi/v1/billingstatuschanges" },
        mockPiBillingStatusChanges({ status: 3 })
      );
      cy.mockResponse(
        { url: "/api/pi/v1/billingstatuschanges", times: 1 },
        mockPiBillingStatusChanges({ status: 2 })
      );
      cy.mockResponse(
        { url: "/api/pi/v1/billingstatuschanges", times: 1 },
        mockPiBillingStatusChanges({ status: 1 })
      );
      cy.visit("/?tab=Approved");
      cy.wait("@records");
    });
  });
  describe("when on Rejected tab", () => {
    it("should render all Rejected proposals", () => {
      cy.mockVoteSummaries(6).as("summaries");
      cy.visit("/?tab=Rejected");
      cy.wait("@records");
    });
  });
  describe("when on Abandoned tab", () => {
    it("should render all Abandoned proposals", () => {
      cy.mockVoteSummaries(7).as("summaries");
      cy.visit("/?tab=Abandoned");
      cy.wait("@records");
    });
  });
});

describe("when Home page fails", () => {
  function errorMock() {
    return {
      errorcode: 1658261424,
    };
  }
  it("should display error when inventory fails", () => {
    // Simulate error on inventory
    cy.mockResponse("/api/ticketvote/v1/inventory", errorMock, {
      statusCode: 500,
    }).as("failedInventory");
    cy.visit("/");
    cy.wait("@failedInventory");
    // Should display error message with the server error code
    cy.findByTestId("proposals-list-error")
      .should("be.visible")
      .should("include.text", "1658261424");
    // Only one inventory call
    cy.get("@failedInventory.all").should("have.length", 1);
    // no further requests
    cy.get("@records.all").should("have.length", 0);
    cy.get("@summaries.all").should("have.length", 0);
    cy.get("@counts.all").should("have.length", 0);
  });
  it("should display error when records fails", () => {
    cy.mockInventory(1).as("inventory");
    // Simulate error on records
    cy.mockResponse("/api/records/v1/records", errorMock, {
      statusCode: 500,
    }).as("failedRecords");
    cy.visit("/");
    cy.wait("@failedRecords");

    cy.findByTestId("status-list-error")
      .should("be.visible")
      .should("include.text", "1658261424");

    // Only one call for each
    cy.get("@inventory.all").should("have.length", 1);
    cy.get("@failedRecords.all").should("have.length", 1);
    cy.get("@summaries.all").should("have.length", 1);
    cy.get("@counts.all").should("have.length", 1);
  });
  it("should display missing status when pi summaries fails", () => {
    cy.mockInventory(1).as("inventory");
    cy.mockResponse("/api/pi/v1/summaries", errorMock, {
      statusCode: 500,
    }).as("failedPiSummaries");

    cy.visit("/");

    cy.findAllByTestId("record-card-right-header").should("have.length", 3);
    cy.findAllByText("missing").should("have.length", 3);
  });
  it("should not display comments counts when it fails", () => {
    cy.mockInventory(1).as("inventory");
    cy.mockResponse("/api/comments/v1/count", errorMock, {
      statusCode: 500,
    }).as("failedCounts");

    cy.visit("/");
    // Make sure all records requests are dispatched
    cy.wait("@records");
    cy.wait("@records");
    cy.wait("@records");

    cy.findAllByTestId("comments-count").should("not.exist");
  });
});
