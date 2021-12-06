import { inventoryReply as recordsInventoryReply } from "../core/api";
import { Summary, Timestamp } from "./generate";
import { statusToString, stringToStatus, typeFromStatus } from "./utils";
import { chunkByStatusAmount } from "../core/utils";
import times from "lodash/fp/times";

export const API_BASE_URL = "/api/ticketvote/v1";

/**
 * summariesReply is the reply to the Summaries command. The returned maps are
 * { [token]: Summary }, where Summary is the ticketvote generated summary
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} summaries map
 */
export function summariesReply({
  testParams: { resultsByStatus = {}, amountByStatus, runoff = false },
  requestParams: { tokens = [] }
}) {
  const tokensByStatus = chunkByStatusAmount(tokens, amountByStatus);
  const summaries = Object.entries(tokensByStatus).reduce(
    (acc, [status, tokens]) => {
      return {
        ...acc,
        ...tokens.reduce(
          (sum, token) => ({
            ...sum,
            [token]: new Summary({
              results: resultsByStatus[status],
              status: stringToStatus(status),
              type: typeFromStatus(status, runoff)
            })
          }),
          {}
        )
      };
    },
    {}
  );
  return { summaries };
}

/**
 * inventoryReply is the reply to the Inventory command. The returned maps are
 * { [status]: [...tokens] } where the `status` is the human readable ticketvote
 * status. This method extends the core `inventoryReply` method.
 *
 * @param {Object} { testParams, requestParams }
 * @returns {Object} inventory map
 */
export function inventoryReply({
  testParams,
  requestParams: { status, ...requestParams }
}) {
  const inventory = recordsInventoryReply({ testParams, requestParams });
  if (status) {
    const readableStatus = statusToString(status);
    return Object.entries(inventory).reduce(
      (acc, [state, statuses]) => ({
        ...acc,
        [state]: {
          [readableStatus]: statuses[readableStatus]
        }
      }),
      {}
    );
  }
  return inventory;
}

/**
 * policyReply is the reply to the Policy command. The returned maps are
 * { [rule]: value }, where `rule` is the policy rule.
 *
 * @returns {Object} Policy
 */
export function policyReply() {
  return {
    linkbyperiodmin: 1,
    linkbyperiodmax: 7776000,
    votedurationmin: 1,
    votedurationmax: 4032,
    summariespagesize: 5,
    inventorypagesize: 20,
    timestampspagesize: 100
  };
}

export function timestampsReply({
  testParams: { votesAmount = 0, authsAmount = 0 }
}) {
  const timestamp = new Timestamp();
  const votes = times(() => timestamp)(votesAmount);
  const auths = times(() => timestamp)(authsAmount);
  return { auths, details: timestamp, votes };
}

export const repliers = {
  inventory: inventoryReply,
  policy: policyReply,
  summaries: summariesReply,
  timestamps: timestampsReply
};
