/*
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import set from "lodash/set";
import { loggedInAsUsername, loggedInAsEmail } from "../selectors/api";

// Logged in state key refers to the chunck of the state which will be stored
// in the local storage only while the user stills logged in
export const loggedInStateKey = "state";

// Persistent state key refers to the chunck of state which will persist
// in the local storage even if the user logs out
export const persistentStateKey = email => `state-${email}`;

export const stateKey = email =>
  email ? persistentStateKey(email) : loggedInStateKey;

export const loadStateLocalStorage = email => {
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

export const clearStateLocalStorage = email => {
  const key = stateKey(email);
  if (localStorage.getItem(key)) {
    localStorage.setItem(key, "");
  }
};

const handleSaveApiMe = state => {
  const email = loggedInAsEmail(state);
  const proposalcredits = state.app.proposalCredits;
  const username = loggedInAsUsername(state);
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

const handleSaveAppDraftProposals = state => {
  const email = loggedInAsEmail(state);
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

export const handleSaveStateToLocalStorage = state => {
  handleSaveApiMe(state);
  handleSaveAppDraftProposals(state);
};
