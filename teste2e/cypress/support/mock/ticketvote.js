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
  summaries: ({ status } = {}) =>
    // TODO: Allow more than one status
    cy.intercept("/api/ticketvote/v1/summaries", (req) => {
      const makeSummary = (status = 0) => ({
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
      });
      const { tokens } = req.body;
      const summaries = tokens.reduce(
        (acc, t) => ({
          ...acc,
          [t]: makeSummary(status)
        }),
        {}
      );
      req.reply({ body: { summaries } });
    }),
  policy: () =>
    cy.intercept("/api/ticketvote/v1/policy", (req) => {
      req.reply({
        body: {
          linkbyperiodmin: 1,
          linkbyperiodmax: 7776000,
          votedurationmin: 1,
          votedurationmax: 4032
        }
      });
    })
};
