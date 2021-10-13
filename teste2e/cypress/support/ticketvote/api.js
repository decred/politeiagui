import { inventoryReply as recordsInventoryReply } from "../core/api";
import { Summary } from "./generate";
import { statusToString } from "./utils";

export const API_BASE_URL = "/api/ticketvote/v1";

export function summariesReply({
  testParams: { results, status },
  requestParams: { tokens = [] }
}) {
  // TODO: Improve summary replier
  return tokens.reduce(
    (acc, t) => ({
      ...acc,
      [t]: new Summary({ results, status })
    }),
    {}
  );
}

/**
 * inventoryReply is the reply to the Inventory command. The returned maps are
 * map[status][]token where the status is the human readable ticketvote status.
 * This method extends the core `inventoryReply` method.
 * @param {Object} props
 * @param {Object} requestParams
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

export const repliers = {
  inventory: inventoryReply,
  summaries: summariesReply
};
