import {
  getRfpRecordLink,
  isProposalCompleteOrClosed,
  isRfpProposal,
  proposalFilenames,
} from "../../pi/proposals/utils";

export async function onRecordDetailsFullToken(
  effect,
  { payload },
  { dispatch, getState }
) {
  const state = getState();
  await effect(state, dispatch, { token: payload.censorshiprecord.token });
}

export async function onCompletedOrClosedProposalFetch(
  effect,
  { payload, meta },
  { getState, dispatch }
) {
  const state = getState();
  const [token] = meta.arg.tokens;
  const { status } = Object.values(payload.summaries)[0];

  if (isProposalCompleteOrClosed(status)) {
    await effect(state, dispatch, { token });
  }
}

export async function onRfpProposalFetch(
  effect,
  { payload: record },
  { getState, dispatch }
) {
  const state = getState();
  if (isRfpProposal(record)) {
    await effect(state, dispatch, { token: record.censorshiprecord.token });
  }
}

export async function onVoteSubmissionsFetch(
  effect,
  { payload },
  { getState, dispatch }
) {
  const state = getState();
  const { submissions } = payload;
  await effect(state, dispatch, {
    inventoryList: submissions,
    filenames: proposalFilenames,
  });
}

export async function onRfpSubmissionFetch(
  effect,
  { payload: record },
  { getState, dispatch, unsubscribe, subscribe }
) {
  unsubscribe();
  const state = getState();
  const token = getRfpRecordLink(record);
  if (token) {
    await effect(state, dispatch, {
      inventoryList: [token],
      filenames: proposalFilenames,
    });
  }
  subscribe();
}
