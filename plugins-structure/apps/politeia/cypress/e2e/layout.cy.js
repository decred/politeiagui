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

beforeEach(() => {
  cy.mockResponse(
    "/api/ticketvote/v1/inventory",
    mockTicketvoteInventory(1)
  ).as("inventory");
  cy.mockResponse("/api/comments/v1/count", mockCommentsCount()).as("counts");
  cy.mockResponse(
    "/api/records/v1/records",
    mockRecordsBatch(mockProposal())
  ).as("records");
  cy.mockResponse("/api/comments/v1/comments", mockComments()).as("comments");
  cy.mockResponse("/api/records/v1/details", mockProposalDetails()).as(
    "details"
  );
  cy.mockResponse("/api/ticketvote/v1/summaries", mockTicketvoteSummaries()).as(
    "voteSummaries"
  );
  cy.mockResponse("/api/pi/v1/summaries", mockPiSummaries()).as("piSummaries");
});

describe("Given app layout", () => {
  describe("for mobile devices", () => {
    it("should render About Politeia on drawer and overflow screen", () => {
      cy.viewport("iphone-x");
      cy.visit("/");
      cy.wait("@records");
      cy.findByTestId("common-ui-navbar").should("be.visible");
      cy.findByTestId("common-ui-navbar-toggle").should("be.visible").click();
      cy.findByTestId("common-ui-navbar-drawer-content")
        .findByTestId("about-politeia")
        .should("be.visible");
    });
  });
  describe("for tablets", () => {
    it("should render About Politeia on drawer and still show page content", () => {
      cy.viewport("ipad-2");
      cy.visit("/");
      cy.wait("@records");
      cy.findByTestId("common-ui-navbar").should("be.visible");
      cy.findByTestId("common-ui-navbar-toggle").should("be.visible").click();
      cy.findByTestId("common-ui-navbar-drawer-content")
        .findByTestId("about-politeia")
        .should("be.visible");
      cy.findByTestId("common-ui-page-banner").should("be.visible");
    });
  });
  describe("for small laptops", () => {
    it("should render About Politeia on drawer and still show page content", () => {
      cy.viewport("macbook-11");
      cy.visit("/");
      cy.wait("@records");
      cy.findByTestId("common-ui-navbar").should("be.visible");
      cy.findByTestId("common-ui-navbar-toggle").should("not.be.visible");
      cy.findByTestId("about-politeia").should("be.visible");
      cy.findByTestId("common-ui-page-banner").should("be.visible");
    });
  });
});

describe("Given app theme", () => {
  const lightNavColor = "rgb(249, 250, 250)";
  const darkNavColor = "rgb(31, 50, 95)";
  it("should switch theme on toggle click", () => {
    cy.viewport("macbook-11");
    cy.visit("/");
    // Light theme as default
    cy.findByTestId("common-ui-navbar").should(
      "have.css",
      "background-color",
      lightNavColor
    );
    // Toggle theme
    cy.findByTestId("darkLightToggle").should("be.visible").click();
    // Dark Theme applied
    cy.findByTestId("common-ui-navbar").should(
      "have.css",
      "background-color",
      darkNavColor
    );
    // Back to light theme
    cy.findByTestId("darkLightToggle").should("be.visible").click();
    cy.findByTestId("common-ui-navbar").should(
      "have.css",
      "background-color",
      lightNavColor
    );
  });
  it("should persist theme after page reload", () => {
    cy.viewport("macbook-11");
    cy.visit("/");
    // Light theme as default
    cy.findByTestId("common-ui-navbar").should(
      "have.css",
      "background-color",
      lightNavColor
    );
    cy.findByTestId("darkLightToggle").should("be.visible").click();
    // Refresh page
    cy.reload();
    // Dark Theme applied
    cy.findByTestId("common-ui-navbar").should(
      "have.css",
      "background-color",
      darkNavColor
    );
  });
});
