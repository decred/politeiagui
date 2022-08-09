import { piBilling } from "./";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchSingleRecordBillingStatusChanges(
  state,
  dispatch,
  { token }
) {
  const hasBillingStatusChanges = piBilling.selectByToken(state, token);
  if (!hasBillingStatusChanges)
    await dispatch(piBilling.fetch({ tokens: [token] }));
}

export async function fetchRecordsBillingStatusChanges(
  state,
  dispatch,
  { inventoryList }
) {
  const {
    piBilling: { byToken },
    piPolicy: {
      policy: { billingstatuschangespagesize },
    },
  } = state;

  const billingStatusesToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: byToken,
    pageSize: billingstatuschangespagesize,
  });

  if (!isEmpty(billingStatusesToFetch)) {
    await dispatch(piBilling.fetch({ tokens: billingStatusesToFetch }));
  }
}
