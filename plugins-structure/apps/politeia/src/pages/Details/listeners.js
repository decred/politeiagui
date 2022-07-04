import { records } from "@politeiagui/core/records";
import { fetchProposalDetails } from "./actions";

async function getFullToken(state, dispatch, token) {
  const storeToken = records.selectFullToken(state, token);
  if (storeToken) {
    const record = records.selectByToken(state, storeToken);
    // means details was already fetched
    if (record.files.length === 2) {
      return [storeToken, true];
    }
    return [storeToken, false];
  }
  const res = await dispatch(records.fetchDetails({ token }));
  const fetchedRecord = res.payload;
  return [fetchedRecord?.censorshiprecord?.token, true];
}

function injectEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const [fullToken] = await getFullToken(state, dispatch, payload);
    await effect(state, dispatch, { token: fullToken });
    subscribe();
  };
}

function injectfetchRecordDetailsEffect(effect) {
  return async (
    { payload },
    { getState, dispatch, unsubscribe, subscribe }
  ) => {
    unsubscribe();
    const state = getState();
    const [fullToken, detailsFetched] = await getFullToken(
      state,
      dispatch,
      payload
    );
    await effect(state, dispatch, { token: fullToken, detailsFetched });
    subscribe();
  };
}

export const initializefetchProposalDetailsListener = {
  actionCreator: fetchProposalDetails,
  injectEffect,
};

export const initializeRecordDetailsFetchProposalDetailsListener = {
  actionCreator: fetchProposalDetails,
  injectEffect: injectfetchRecordDetailsEffect,
};
