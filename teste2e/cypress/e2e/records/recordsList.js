import { makeMockProposalResponse } from "../../support/mock/records";
import { inventoryByPage } from "../../support/mock/ticketvote";

const interceptInventoryRequest = () =>
  cy.intercept("/api/ticketvote/v1/inventory", (req) => {
    req.reply({
      body: {
        bestBlock: 718066,
        vetted: inventoryByPage[req.body.page || 0],
        test: true
      }
    });
  });

const interceptRecordsRequest = () =>
  cy.intercept("/api/records/v1/records", (req) => {
    const tokens = req.body.requests.map(({ token }) => token);
    const proposals = tokens.reduce(
      (acc, t) => ({
        ...acc,
        [t]: makeMockProposalResponse(t, {})
      }),
      {}
    );
    req.reply({
      body: { records: proposals }
    });
  });

describe("Records list", () => {
  describe("proposal list", () => {
    it("can render first proposals batch", () => {
      let inv;

      interceptInventoryRequest().as("inventory");
      interceptRecordsRequest().as("records");
      cy.visit(`/`);
      cy.wait("@inventory").then(({ response: { body } }) => {
        console.log(body);
        inv = body;
      });
    });
  });
});
