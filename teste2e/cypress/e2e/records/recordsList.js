const statusByTab = {
  "In Discussion": ["authorized", "unauthorized"],
  Voting: ["started"],
  Approved: ["approved"],
  Rejected: ["rejected"],
  Abandoned: ["ineligible"]
};

const RECORDS_PAGE_SIZE = 5;

const getTokensByStatusTab = (inventory, currentTab) =>
  statusByTab[currentTab]
    ? statusByTab[currentTab].reduce(
        (acc, status) => [...acc, ...(inventory[status] || [])],
        []
      )
    : [];

describe("Records list", () => {
  describe("proposal list", () => {
    beforeEach(() => {
      cy.middleware("ticketvote.inventory", {
        approved: 4,
        authorized: 0,
        ineligible: 3,
        rejected: 5,
        started: 3,
        unauthorized: 25
      });
      cy.middleware("records.records");
    });
    it("can render first proposals batch according to inventory order", () => {
      let inventory;
      cy.visit(`/`);
      cy.wait("@ticketvote.inventory").then(({ response: { body } }) => {
        inventory = body.vetted;
      });
      cy.wait("@records.records");
      // each proposal should be rendered accordingly to inventory response
      cy.assertListLengthByTestId("record-title", RECORDS_PAGE_SIZE) // first records batch
        .each(([{ id }], position) => {
          const tokens = getTokensByStatusTab(inventory, "In Discussion");
          const expectedToken = tokens[position];
          expect(id).to.have.string(expectedToken);
        });
    });
    it("can render records and inventory pagination correctly", () => {
      cy.visit(`/`);
      cy.wait("@ticketvote.inventory");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 5);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 10);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 15);
      cy.scrollTo("bottom");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 20);
      // finished first inventory page
      cy.scrollTo("bottom");
      cy.wait("@ticketvote.inventory").its("request.body.page").should("eq", 2);
      cy.wait("@records.records");
      // records from second inventory page
      cy.assertListLengthByTestId("record-title", 25);
      cy.scrollTo("bottom");
      // wait to see if no requests are done, since inventory is fully fetched
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title", 25);
    });

    it("can switch tabs and load proposals correctly", () => {
      cy.visit("/?tab=approved");
      cy.wait("@ticketvote.inventory");
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 4);
      // navigate to in discussion tab
      cy.findByTestId("tab-0").click();
      cy.wait("@records.records");
      cy.assertListLengthByTestId("record-title", 5);
    });
    it("can list legacy proposals", () => {
      // for approved proposals
      cy.visit("/?tab=approved");
      cy.wait("@ticketvote.inventory");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title-legacy", 58);
      // for rejected proposals
      cy.visit("/?tab=rejected");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title-legacy", 37);
      // for abandoned proposals
      cy.visit("/?tab=abandoned");
      cy.wait(1000);
      cy.assertListLengthByTestId("record-title-legacy", 20);
    });
    it("can load sidebar according to screen resolution", () => {
      cy.visit("/");
      cy.findByTestId("sidebar").should("be.visible");
      cy.viewport("iphone-6");
      cy.findByTestId("sidebar").should("be.hidden");
      cy.viewport(1000, 500); // sidebar breakpoint
      cy.findByTestId("sidebar").should("be.hidden");
      cy.viewport(1001, 500);
      cy.findByTestId("sidebar").should("be.visible");
    });

    // The test below is currently broken. Check issue #2471
    // it("can render loading placeholders properly", () => {
    //   cy.visit(`/`);
    //   cy.assertListLengthByTestId("loading-placeholders", 5);
    // });
  });
});
