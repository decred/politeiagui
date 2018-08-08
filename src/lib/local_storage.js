/*
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import set from "lodash/set";
import { loggedInAsUsername, loggedInAsEmail } from "../selectors/api";

export const stateKey = (email) => `state-${email}`;

export const loadStateLocalStorage = (email) => {
  try {
    const serializedState = localStorage.getItem(stateKey(email));
    if (!serializedState) return undefined;
    else return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveStateLocalStorage = (state, email) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(stateKey(email), serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const clearStateLocalStorage = (email) => {
  const key = stateKey(email);
  if(localStorage.getItem(key)){
    localStorage.setItem(key, "");
  }
};

const handleSaveApiMe = (state) => {
  const email = loggedInAsEmail(state);
  const username = loggedInAsUsername(state);
  const stateFromLs = loadStateLocalStorage(email) || {};
  const apiMeFromStorage = get(stateFromLs, ["api", "me"], undefined);
  const apiMeResponseFromStorage = get(apiMeFromStorage, "response", undefined);
  const apiMe = get(state, ["api", "me"], undefined);
  const apiMeResponse = get(apiMe, "response", undefined);
  const customResponse = {
    ...apiMeResponse,
    username,
    email
  };
  if(apiMeResponse && !isEqual(apiMeResponseFromStorage, customResponse)) {
    saveStateLocalStorage(
      set(stateFromLs, ["api", "me", "response"], customResponse),
      email
    );
  }
};

const handleSaveAppDraftProposals = (state) => {
  const email = loggedInAsEmail(state);
  const stateFromLs = loadStateLocalStorage(email) || {};
  const draftProposalsFromStore = state.app.draftProposals;
  const draftProposalsLocalStorage = get(stateFromLs, ["app", "draftProposals"], {});

  if (draftProposalsFromStore &&
    !isEqual(draftProposalsFromStore, draftProposalsLocalStorage)) {
    const newValue = set(stateFromLs, ["app", "draftProposals"], draftProposalsFromStore);
    saveStateLocalStorage(
      newValue,
      email
    );
  }
};

export const deleteDraftProposalFromLocalStorage = (name) => {
  const draftProposalsLocalStorage = get(loadStateLocalStorage(), ["app", "draftProposals"], {});
  const nameOrLastName = name || draftProposalsLocalStorage.lastSubmitted;
  const localStorageState = loadStateLocalStorage();
  if (draftProposalsLocalStorage[nameOrLastName]) {
    delete draftProposalsLocalStorage[nameOrLastName];
    saveStateLocalStorage({
      ...localStorageState,
      app: {
        draftProposals: draftProposalsLocalStorage
      }
    });
  }
};

export const getDraftsProposalsFromLocalStorage = () => {
  return get(loadStateLocalStorage(), ["app", "draftProposals"], {});
};

export const getDraftByNameFromLocalStorage = (state) => {
  const email = loggedInAsEmail(state);
  if(!email) {
    return;
  }
  const draftName = (window.location.href.split("/new/").length > 1 &&
    decodeURIComponent(window.location.href).split("/new/")[1].split("/")[0]);
  if (draftName) {
    return getDraftsProposalsFromLocalStorage()[draftName];
  }
  return {name : "", description: ""};
};

export const handleSaveStateToLocalStorage = (state) => {
  handleSaveApiMe(state);
  handleSaveAppDraftProposals(state);
};
