import "@testing-library/cypress/add-commands";
import "@politeiagui/core/dev/cypress";

import { mockCommentsCount } from "@politeiagui/comments/dev/mocks";
import { mockRecordsBatch } from "@politeiagui/core/dev/mocks";
import {
  mockPiBillingStatusChanges,
  mockPiSummaries,
  mockProposal,
} from "../../src/pi/dev/mocks";
import {
  mockTicketvoteSummaries,
  ticketvoteSummariesByStatus,
} from "@politeiagui/ticketvote/dev/mocks";

const proposalStatusMap = {
  unauthorized: {
    voteStatus: "unauthorized",
    recordsStatus: "public",
    recordsState: "vetted",
    piStatus: "under-review",
  },
  authorized: {
    voteStatus: "authorized",
    recordsStatus: "public",
    recordsState: "vetted",
    piStatus: "vote-authorized",
  },
  started: {
    voteStatus: "started",
    recordsStatus: "public",
    recordsState: "vetted",
    piStatus: "vote-started",
  },
  approved: {
    voteStatus: "approved",
    recordsStatus: "public",
    recordsState: "vetted",
    piStatus: "active",
  },
  rejected: {
    voteStatus: "rejected",
    recordsStatus: "public",
    recordsState: "vetted",
    piStatus: "rejected",
  },
  ineligible: {
    voteStatus: "ineligible",
    recordsStatus: "public",
    recordsState: "vetted",
    piStatus: "abandoned",
  },
};

Cypress.Commands.add("mockProposalsBatch", (status, matcherParams = {}) => {
  const { voteStatus, recordsStatus, recordsState, piStatus } =
    proposalStatusMap[status];
  cy.mockResponse(
    { url: "/api/comments/v1/count", ...matcherParams },
    mockCommentsCount()
  ).as("counts");
  cy.mockResponse(
    { url: "/api/records/v1/records", ...matcherParams },
    mockRecordsBatch(
      mockProposal({ state: recordsState, status: recordsStatus })
    )
  ).as("records");
  cy.mockResponse(
    { url: "/api/ticketvote/v1/summaries", ...matcherParams },
    mockTicketvoteSummaries(ticketvoteSummariesByStatus[voteStatus])
  ).as("voteSummaries");
  cy.mockResponse(
    { url: "/api/pi/v1/summaries", ...matcherParams },
    mockPiSummaries({ status: piStatus })
  ).as("piSummaries");
  cy.mockResponse(
    "/api/pi/v1/billingstatuschanges",
    mockPiBillingStatusChanges()
  ).as("billingstatuschanges");
});

Cypress.Commands.add(
  "waitProposalsBatch",
  ({ hasBilling, hasCounts = true } = {}) => {
    const waitAliases = ["@records", "@piSummaries", "@voteSummaries"];
    if (hasBilling) waitAliases.push("@billingstatuschanges");
    if (hasCounts) waitAliases.push("@counts");
    return cy.wait(waitAliases);
  }
);

Cypress.Commands.add("assertProposalsListLength", (length) =>
  cy.findAllByTestId("proposal-card").should("have.length", length)
);
