beforeEach(function mockApiCalls() {
  // currently mocking pi and ticketvote summaries calls with any status, since
  // they aren't used for assertions. the `Missing` status will show up, but it
  // doesn't affect the list behavior.
  cy.useTicketvoteApi();
  cy.useRecordsApi();
  cy.usePiApi();
  cy.useWwwApi();
  cy.useCommentsApi();
  cy.userEnvironment("noLogin");
});

describe("Given an approved proposal", () => {
  beforeEach(() => {
    cy.ticketvoteMiddleware();
  });
  it("should be able to download votes timestamps", () => {});
});
