import range from "lodash/range";

// const interceptSummariesRequest = () => cy.intercept("/");

const statusByTab = {
  "In Discussion": ["authorized", "unauthorized"],
  Voting: ["started"],
  Approved: ["approved"],
  Rejected: ["rejected"],
  Abandoned: ["ineligible"]
};

const getTokensByStatusList = (inventory, currentTab) =>
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
        ineligible: 45,
        rejected: 25,
        started: 3,
        unauthorized: 25
      });
      cy.middleware("record.records");
    });
    it("can render first proposals batch according to inventory", () => {
      let inventory;
      cy.visit(`/`);
      cy.wait("@ticketvote.inventory").then(({ response: { body } }) => {
        inventory = body.vetted;
      });
      cy.wait("@record.records");
      // each proposal should be rendered accordingly to inventory response
      cy.get('[data-testid="record-title"]')
        .should("have.length", 5) // first records batch
        .each(([{ id }], position) => {
          const tokens = getTokensByStatusList(inventory, "In Discussion");
          expect(id).to.have.string(tokens[position]);
        });
    });
    it("can render record and inventory pagination correctly", () => {
      cy.visit(`/`);
      cy.wait("@record.records");
      cy.get('[data-testid="record-title"]').should("have.length", 5);
      cy.scrollTo("bottom");
      cy.wait("@record.records");
      cy.get('[data-testid="record-title"]').should("have.length", 10);
      cy.scrollTo("bottom");
      cy.wait("@record.records");
      cy.get('[data-testid="record-title"]').should("have.length", 15);
      cy.scrollTo("bottom");
      cy.wait("@record.records");
      cy.get('[data-testid="record-title"]').should("have.length", 20);
      cy.wait(1000);
      // finished first inventory page
      cy.scrollTo("bottom");
      cy.wait("@record.records");
      // records from second inventory page
      cy.wait("@ticketvote.inventory").its("request.body.page").should("eq", 2); //TODO fix this assertion
      cy.get('[data-testid="record-title"]').should("have.length", 25);
      cy.scrollTo("bottom");
      // wait to see
      cy.wait(200);
    });
  });
});
