/*
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import set from "lodash/set";
import {
  currentUserUsername,
  currentUserEmail
} from "../selectors/models/users";

// Logged in state key refers to the chunck of the state which will be stored
// in the local storage only while the user stills logged in
export const loggedInStateKey = "state";

// Persistent state key refers to the chunck of state which will persist
// in the local storage even if the user logs out
export const persistentStateKey = (email) => `state-${email}`;

export const stateKey = (email) =>
  email ? persistentStateKey(email) : loggedInStateKey;

export const loadStateLocalStorage = (email) => {
  try {
    const serializedState = localStorage.getItem(stateKey(email));
    if (!serializedState) return undefined;
    else return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveStateLocalStorage = (state, email = "") => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateKey(email), serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const clearStateLocalStorage = (email) => {
  const key = stateKey(email);
  if (localStorage.getItem(key)) {
    localStorage.setItem(key, "");
  }
};

const handleSaveApiMe = (state) => {
  const email = currentUserEmail(state);
  const proposalcredits = state.app.proposalCredits;
  const username = currentUserUsername(state);
  const stateFromLs = loadStateLocalStorage() || {};
  const apiMeFromStorage = get(stateFromLs, ["api", "me"], undefined);
  const apiMeResponseFromStorage = get(apiMeFromStorage, "response", undefined);
  const apiMe = get(state, ["api", "me"], undefined);
  const apiMeResponse = get(apiMe, "response", undefined);
  const customResponse = {
    ...apiMeResponse,
    username,
    email,
    proposalcredits
  };
  if (apiMeResponse && !isEqual(apiMeResponseFromStorage, customResponse)) {
    saveStateLocalStorage(
      set(stateFromLs, ["api", "me", "response"], customResponse)
    );
  }
};

export const handleSaveAppDraftProposals = (state) => {
  const email = currentUserEmail(state);
  if (!email) {
    return;
  }
  const stateFromLs = loadStateLocalStorage(email) || {};
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
    saveStateLocalStorage(newValue, email);
  }
};

export const handleSaveAppDraftInvoices = (state) => {
  const email = currentUserEmail(state);
  if (!email) {
    return;
  }
  const stateFromLs = loadStateLocalStorage(email) || {};
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
    saveStateLocalStorage(newValue, email);
  }
};

const handleSaveAppDraftDCCs = (state) => {
  const email = currentUserEmail(state);
  if (!email) return;
  const stateFromLs = loadStateLocalStorage(email) || {};
  const draftDCCsFromStore = state.app.draftDCCs;
  const draftDCCsFromLocalStorage = get(stateFromLs, ["app", "draftDCCs"], {});

  if (
    draftDCCsFromStore &&
    !isEqual(draftDCCsFromStore, draftDCCsFromLocalStorage)
  ) {
    const newValue = set(stateFromLs, ["app", "draftDCCs"], draftDCCsFromStore);
    saveStateLocalStorage(newValue, email);
  }
};

export const handleSaveStateToLocalStorage = (state) => {
  handleSaveApiMe(state);
  handleSaveAppDraftProposals(state);
  handleSaveAppDraftDCCs(state);
  handleSaveAppDraftInvoices(state);
};
