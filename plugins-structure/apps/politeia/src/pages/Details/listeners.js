import { fetchProposalDetails } from "./actions";

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

export const fetchDetailsListenerCreator = {
  type: "records/fetchDetails/fulfilled",
  injectEffect,
};

export const recordFetchDetailsListenerCreator = {
  actionCreator: fetchProposalDetails,
  injectEffect: injectRecordDetailsEffect,
};
