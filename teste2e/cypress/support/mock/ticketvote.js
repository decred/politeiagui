import { makeCustomInventoryByStatus } from "../generate";
import { getProposalStatusLabel } from "../../utils";

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
    }),
  // XXX revert when 2549 is in!
  summaries: ({ token, status }) =>
    cy.intercept("/api/ticketvote/v1/summaries", (req) => {
      req.continue((res) => {
        res.body.summaries[token] = {
          type: 0,
          status,
          duration: 0,
          startblockheight: 0,
          startblockhash: "",
          endblockheight: 0,
          eligibletickets: 0,
          quorumpercentage: 0,
          passpercentage: 0,
          results: [],
          bestblock: 767301
        };
        res.send(res.body);
      });
    })
};
