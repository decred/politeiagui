import "./commands";
import { mockTicketvotePolicy } from "@politeiagui/ticketvote/dev/mocks";
import { mockCommentsPolicy } from "@politeiagui/comments/dev/mocks";
import { mockApi, mockRecordsPolicy } from "@politeiagui/core/dev/mocks";
import { mockPiPolicy } from "../../src/pi/dev/mocks";

beforeEach(() => {
  // Initial Home Mocks setup
  cy.mockResponse("/api", mockApi({ mode: "piwww" }), {
    headers: {
      "X-Csrf-Token": "csrf-test-token",
    },
  });
  // Records
  cy.mockResponse("/api/records/v1/policy", mockRecordsPolicy());
  // Comments
  cy.mockResponse("/api/comments/v1/policy", mockCommentsPolicy());
  // Ticketvote
  cy.mockResponse("/api/ticketvote/v1/policy", mockTicketvotePolicy());
  // Pi
  cy.mockResponse("/api/pi/v1/policy", mockPiPolicy());
});
