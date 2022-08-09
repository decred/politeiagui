import { fetchProposalDetails } from "./actions";
import { isProposalCompleteOrClosed } from "../../pi/utils";

function injectEffect(effect) {
  return async ({ payload }, { getState, dispatch }) => {
    const state = getState();
    await effect(state, dispatch, { token: payload.censorshiprecord.token });
  };
}

function injectRecordDetailsEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, {
      token: payload,
    });
    subscribe();
  };
}

function injectCompletedOrClosedProposalEffect(effect) {
  return async (
    { payload, meta },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const [token] = meta.arg.tokens;
    const { status } = Object.values(payload.summaries)[0];

    if (isProposalCompleteOrClosed(status)) {
      await effect(state, dispatch, { token });
    }
    subscribe();
  };
}

function injectPayloadEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, payload);
    subscribe();
  };
}

export const fetchDetailsListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect,
};

export const fetchProposalSummaryListenerCreator = {
  type: "piSummaries/fetch/fulfilled",
  injectEffect: injectCompletedOrClosedProposalEffect,
};

export const recordFetchDetailsListenerCreator = {
  actionCreator: fetchProposalDetails,
  injectEffect: injectRecordDetailsEffect,
};

export const fetchVoteSummaryListenerCreator = {
  type: "ticketvoteSummaries/fetch/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const fetchBillingStatusChangesListenerCreator = {
  type: "piBilling/fetchStatusChanges/fulfilled",
  injectEffect: injectPayloadEffect,
};

export const fetchRecordDetailsListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect: injectPayloadEffect,
};
