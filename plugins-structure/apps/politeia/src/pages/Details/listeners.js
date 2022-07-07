import { fetchProposalDetails } from "./actions";

function injectEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    await effect(state, dispatch, { token: payload.censorshiprecord.token });
    subscribe();
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

export const fetchDetailsListener = {
  type: "records/fetchDetails/fulfilled",
  injectEffect,
};

export const recordFetchDetailsListener = {
  actionCreator: fetchProposalDetails,
  injectEffect: injectRecordDetailsEffect,
};
