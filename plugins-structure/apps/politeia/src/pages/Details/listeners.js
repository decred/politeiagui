import { records } from "@politeiagui/core/records";
import { fetchProposalDetails } from "./actions";

async function waitForFullToken(token, take) {
  const [_, currentState] = await take((_, currentState) => {
    const storeToken = records.selectFullToken(currentState, token);
    return storeToken;
  });
  return records.selectFullToken(currentState, token);
}

function injectEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe, take }
  ) => {
    unsubscribe();
    const state = getState();
    const fullToken = await waitForFullToken(payload, take);
    await effect(state, dispatch, { token: fullToken });
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
  actionCreator: fetchProposalDetails,
  injectEffect,
};

export const recordFetchDetailsListener = {
  actionCreator: fetchProposalDetails,
  injectEffect: injectRecordDetailsEffect,
};
