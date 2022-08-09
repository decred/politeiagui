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

// Works for both single record or records batch
export async function setProposalsRecordsStatusChangesEffect(
  state,
  dispatch,
  payload
) {
  const records =
    payload.state && payload.status
      ? { [payload.censorshiprecord.token]: payload }
      : payload;
  await dispatch(proposals.setRecordStatusChanges({ records }));
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
