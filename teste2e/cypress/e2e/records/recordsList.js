import { proposals } from "../../support/mock/records";
import * as ticketvote from "../../support/mock/ticketvote";
beforeEach(() => {
  // mock inventory requests
  cy.intercept("/api/ticketvote/v1/inventory", (req) => {
    console.log("REQ", req);
    if (req.body.status === 0) {
      req.reply({
        body: {
          bestBlock: 718066,
          vetted: ticketvote.inventory5unauthorized,
          test: true
        }
      });
    }
  });
});
describe("Records list", () => {
  describe("proposal list", () => {
    it("can render first proposals batch", () => {
      // cy.intercept("POST", "/api/ticketvote/v1/inventory", {
      //   body: {
      //     bestBlock: 718066,
      //     vetted: inventory
      //   }
      // }).as("inventory");
      cy.visit(`/`);
      cy.wait("@inventory").then(({ response: { body } }) => {
        console.log(body);
      });
    });
  });
});
