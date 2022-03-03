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
  const yes = 250,
    no = 50;
  const total = yes + no;
  beforeEach(() => {
    cy.ticketvoteMiddleware("summaries", {
      amountByStatus: { approved: 1 },
      resultsByStatus: { approved: { yes, no } }
    });
    cy.ticketvoteMiddleware("timestamps", {
      votesAmount: 100,
      authsAmount: 100
    });
    cy.recordsMiddleware("details", { status: 2, state: 2 });
    cy.piMiddleware("summaries", { amountByStatus: { active: 1 } });
  });
  it("should be able to download votes timestamps from a single page", () => {
    cy.ticketvoteMiddleware("timestamps", {
      votesAmount: total,
      authsAmount: total
    });
    cy.visit("/record/abcdefg");
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.findByTestId("record-links").click();
    cy.findByText(/votes timestamps/i).click();
    cy.wait(1000);
    cy.get("@ticketvote.timestamps.all").should("have.length.of.at.most", 2);
  });
  it("should be able to download paginated votes timestamps", () => {
    cy.ticketvoteMiddleware("timestamps", {
      votesAmount: total / 2,
      authsAmount: total / 2
    });
    cy.visit("/record/abcdefg");
    cy.wait("@records.details");
    cy.wait("@pi.summaries");
    cy.findByTestId("record-links").click();
    cy.findByText(/votes timestamps/i).click();
    cy.findByText(/50%/i).should("be.visible");
    cy.get("@ticketvote.timestamps.all").should("have.length.of.at.most", 3);
  });
});
