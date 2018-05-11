/* 
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/lang/isEqual";
import get from "lodash/get";
import { onLoadMe } from "../actions/app";
import { onLogout } from "../actions/api";
import { loggedInAsUsername, loggedInAsEmail } from "../selectors/api";

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

const handleSaveApiMe = (store) => {
  const apiMeFromStorage = get(loadStateLocalStorage(), ["api", "me"], undefined);
  const apiMeResponseFromStorage = get(apiMeFromStorage, "response", undefined);
  const apiMe = get(store.getState(), ["api", "me"], undefined);
  const apiMeResponse = get(apiMe, "response", undefined);
  const customResponse = {
    ...apiMeResponse,
    username: loggedInAsUsername(store.getState()),
    email: loggedInAsEmail(store.getState())
  };
  if(apiMeResponse && !isEqual(apiMeResponseFromStorage, customResponse)) {
    saveStateLocalStorage({
      api: {
        me: {
          ...apiMe,
          response: customResponse
        }
      }
    });
  }
};

export const handleSaveStateToLocalStorage = (store) => {
  handleSaveApiMe(store);
};

export const handleStorageChange = (store, event) => {
  const apiMe = get(store.getState(), ["api", "me"], undefined);
  const apiMeResponse = get(apiMe, "response", undefined);
  try {
    const state = JSON.parse(event.newValue);
    const apiMeFromStorage = get(loadStateLocalStorage(), ["api", "me"], undefined);
    const apiMeResponseFromStorage = get(apiMeFromStorage, "response", undefined);
    if(apiMeResponseFromStorage && !isEqual(apiMeResponseFromStorage, apiMeResponse)) {
      store.dispatch(onLoadMe(apiMeFromStorage));
    }
    else if (!state || (state && !state.api.me.response)) store.dispatch(onLogout());
  } catch(e) {
    store.dispatch(onLogout());
  }
};
