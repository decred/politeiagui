import { makeCustomInventoryByStatus } from "../generate";
import upperFirst from "lodash/upperFirst";

export const middlewares = {
  inventory: () =>
    cy.intercept("/api/ticketvote/v1/inventory", (req) => {
      req.reply({
        body: {
          bestBlock: 718066,
          vetted: inventoryByPage[req.body.page || 0],
          test: true
        }
      });
    })
};

export const inventoryByPage = [
  // page 0 and 1 are the same
  makeCustomInventoryByStatus({
    approved: 4,
    authorized: 6,
    ineligible: 10,
    rejected: 20,
    started: 3,
    unauthorized: 20
  }),
  makeCustomInventoryByStatus({
    approved: 4,
    authorized: 6,
    ineligible: 10,
    rejected: 20,
    started: 3,
    unauthorized: 20
  }),
  makeCustomInventoryByStatus({
    approved: 0,
    authorized: 0,
    ineligible: 0,
    rejected: 0,
    started: 0,
    unauthorized: 5
  })
];
