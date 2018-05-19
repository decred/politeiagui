/*
  This lib is designed to handle persisting state data into local storage
*/
import isEqual from "lodash/isEqual";
import get from "lodash/get";
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
      api: {
        me: {
          ...apiMe,
          response: customResponse
        }
      }
    });
  }
};

export const handleSaveStateToLocalStorage = (state) => {
  handleSaveApiMe(state);
};
