/*
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import set from "lodash/set";
import { currentUserID } from "../selectors/models/users";

// Logged in state key refers to the chunck of the state which will be stored
// in the local storage only while the user stills logged in
export const loggedInStateKey = "state";

// Persistent state key refers to the chunck of state which will persist
// in the local storage even if the user logs out
export const persistentStateKey = (uuid) => `state-${uuid}`;

export const stateKey = (uuid) =>
  uuid ? persistentStateKey(uuid) : loggedInStateKey;

export const loadStateLocalStorage = (uuid) => {
  try {
    const serializedState = localStorage.getItem(stateKey(uuid));
    if (!serializedState) return undefined;
    else return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveStateLocalStorage = (state, uuid = "") => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateKey(uuid), serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const clearStateLocalStorage = (uuid) => {
  const key = stateKey(uuid);
  localStorage.removeItem(key);
};

export const handleSaveVotesTimetamps = (token, timestamps) =>
  saveStateLocalStorage(timestamps, `${token}-votes-timestamps`);

export const loadVotesTimestamps = (token) =>
  loadStateLocalStorage(`${token}-votes-timestamps`);

export const handleSaveAppDraftProposals = (state) => {
  const uuid = currentUserID(state);
  if (!uuid) {
    return;
  }
  const stateFromLs = loadStateLocalStorage(uuid) || {};
  const draftProposalsFromStore = state.app.draftProposals;
  const draftProposalsLocalStorage = get(
    stateFromLs,
    ["app", "draftProposals"],
    {}
  );

  if (
    draftProposalsFromStore &&
    !isEqual(draftProposalsFromStore, draftProposalsLocalStorage)
  ) {
    const newValue = set(
      stateFromLs,
      ["app", "draftProposals"],
      draftProposalsFromStore
    );
    saveStateLocalStorage(newValue, uuid);
  }
};

export const handleSaveAppDraftInvoices = (state) => {
  const uuid = currentUserID(state);
  if (!uuid) {
    return;
  }
  const stateFromLs = loadStateLocalStorage(uuid) || {};
  const draftInvoicesFromStore = state.app.draftInvoices;
  const draftInvoicesLocalStorage = get(
    stateFromLs,
    ["app", "draftInvoices"],
    {}
  );

  if (
    draftInvoicesFromStore &&
    !isEqual(draftInvoicesFromStore, draftInvoicesLocalStorage)
  ) {
    const newValue = set(
      stateFromLs,
      ["app", "draftInvoices"],
      draftInvoicesFromStore
    );
    saveStateLocalStorage(newValue, uuid);
  }
};

export const handleSaveAppDraftDccs = (state) => {
  const uuid = currentUserID(state);
  if (!uuid) {
    return;
  }
  const stateFromLs = loadStateLocalStorage(uuid) || {};
  const draftDccsFromStore = state.app.draftDccs;
  const draftDccsLocalStorage = get(stateFromLs, ["app", "draftDccs"], {});

  if (
    draftDccsFromStore &&
    !isEqual(draftDccsFromStore, draftDccsLocalStorage)
  ) {
    const newValue = set(stateFromLs, ["app", "draftDccs"], draftDccsFromStore);
    saveStateLocalStorage(newValue, uuid);
  }
};

export const handleSaveStateToLocalStorage = (state) => {
  handleSaveAppDraftProposals(state);
  handleSaveAppDraftDccs(state);
  handleSaveAppDraftInvoices(state);
};
