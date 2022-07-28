import isArray from "lodash/isArray";
import pick from "lodash/pick";
import { proposals } from "./";

export async function setProposalsVoteStatusChangesEffect(
  state,
  dispatch,
  summaries
) {
  const {
    records: { records },
  } = state;
  await dispatch(proposals.setVoteStatusChanges({ summaries, records }));
}

// Works for both single token and tokens array
export async function setProposalsRecordsStatusChangesEffect(
  state,
  dispatch,
  payload
) {
  let tokens = [];
  if (!payload.token && payload.tokens && isArray(payload.tokens)) {
    tokens = payload.tokens;
  } else if (payload.token && !payload.tokens) {
    tokens = [payload.token];
  }
  const {
    records: { records },
  } = state;
  const fetchedRecords = pick(records, tokens);
  await dispatch(proposals.setRecordStatusChanges({ records: fetchedRecords }));
}

export async function setProposalsBillingStatusChangesEffect(
  state,
  dispatch,
  { billingstatuschanges }
) {
  await dispatch(
    proposals.setBillingStatusChanges({ billings: billingstatuschanges })
  );
}
