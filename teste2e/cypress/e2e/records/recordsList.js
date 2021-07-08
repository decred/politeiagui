import { parseRawProposal } from "../../utils";

// const interceptSummariesRequest = () => cy.intercept("/");

describe("Records list", () => {
  describe("proposal list", () => {
    beforeEach(() => {
      cy.middleware("ticketvote.inventory");
      cy.middleware("record.records");
    });
    it("can render first proposals batch", () => {
      let inventory, records;
      cy.visit(`/`);
      cy.wait("@ticketvote.inventory").then(({ response: { body } }) => {
        inventory = body.vetted;
      });
      cy.wait("@record.records").then(({ response: { body } }) => {
        records = Object.values(body.records).map(parseRawProposal);
        // // fetch first proposals tokens correctly
        // const expectedTokens = inventory.authorized.slice(0, 5);
        // const receivedTokens = Object.keys(body.records);
        // expect(receivedTokens).to.have.ordered.members(expectedTokens);
      });
      cy.get('[data-testid="lazy-list"]').as("list");
      cy.get('[data-testid="record-title"]').each(([el]) => {
        console.log(el.outerText, this.list);
      });
    });
  });
});
