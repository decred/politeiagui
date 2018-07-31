/*
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import { loggedInAsUsername, loggedInAsEmail } from "../selectors/api";
import { getLastSubmittedDraftProposal } from "../selectors/app";

export const loadStateLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (!serializedState) return undefined;
    else return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveStateLocalStorage = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const clearStateLocalStorage = () => {
  if(localStorage.getItem("state")){
    localStorage.setItem("state", "");
  }
};

const handleSaveApiMe = (state) => {
  const apiMeFromStorage = get(loadStateLocalStorage(), ["api", "me"], undefined);
  const apiMeResponseFromStorage = get(apiMeFromStorage, "response", undefined);
  const apiMe = get(state, ["api", "me"], undefined);
  const apiMeResponse = get(apiMe, "response", undefined);
  const customResponse = {
    ...apiMeResponse,
    username: loggedInAsUsername(state),
    email: loggedInAsEmail(state)
  };
  if(apiMeResponse && !isEqual(apiMeResponseFromStorage, customResponse)) {
    saveStateLocalStorage({
      ...loadStateLocalStorage(),
      api: {
        me: {
          ...apiMe,
          response: customResponse
        }
      }
    });
  }
};

const handleSaveAppDraftProposals = (state) => {
  const draftProposalsFromStore = state.app.draftProposals;
  const draftProposalsLocalStorage = get(loadStateLocalStorage(), ["app", "draftProposals"], {});
  const newDraftName = getLastSubmittedDraftProposal(state);
  const newDraftProposal = draftProposalsFromStore[newDraftName];
  if (newDraftName &&
    !isEqual(newDraftProposal, draftProposalsLocalStorage[newDraftName])) {
    saveStateLocalStorage({
      ...loadStateLocalStorage(),
      app: {
        draftProposals: {
          ...draftProposalsLocalStorage,
          [newDraftProposal.name]: newDraftProposal
        }
      }
    });
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

export const getDraftByNameFromLocalStorage = (name) => {
  const draftName = name || window.location.href.split("/new/").length > 1 &&
    decodeURIComponent(window.location.href).split("/new/")[1].split("/")[0];
  if (draftName) {
    return getDraftsProposalsFromLocalStorage()[draftName];
  }
  return {name : "", description: ""};
};

export const handleSaveStateToLocalStorage = (state) => {
  handleSaveApiMe(state);
  handleSaveAppDraftProposals(state);
};
