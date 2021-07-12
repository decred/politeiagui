import { makeCustomInventoryByStatus } from "../generate";
import { getProposalStatusLabel } from "../../utils";
import upperFirst from "lodash/upperFirst";

export const middlewares = {
  inventory: (tokensAmountByStatus) =>
    cy.intercept("/api/ticketvote/v1/inventory", (req) => {
      const inv = makeCustomInventoryByStatus(
        tokensAmountByStatus || {
          approved: 5,
          authorized: 5,
          ineligible: 5,
          rejected: 5,
          started: 5,
          unauthorized: 5
        }
      );
      if (!req.body.status) {
        const tokens = Object.keys(inv).reduce(
          (acc, status) => ({
            ...acc,
            [status]: inv[status][0]
          }),
          {}
        );
        req.reply({
          body: {
            bestBlock: 718066,
            vetted: tokens
          }
        });
      } else {
        const statusLabel = getProposalStatusLabel(req.body.status, false);
        req.reply({
          body: {
            bestBlock: 718066,
            vetted: {
              [statusLabel]:
                inv[statusLabel][req.body.page ? req.body.page - 1 : 0]
            }
          }
        });
      }
    })
};
