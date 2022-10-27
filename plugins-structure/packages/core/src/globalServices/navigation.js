import { createAction, createSlice } from "@reduxjs/toolkit";
import last from "lodash/last";
import isEqual from "lodash/isEqual";
import isString from "lodash/isString";

const initialState = {
  history: [],
};

export const pushNavigation = createAction("globalNavigation/push");
export const popNavigation = createAction("globalNavigation/pop");

const navigationSlice = createSlice({
  name: "globalNavigation",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(pushNavigation, (state, action) => {
        const lastElement = last(state.history);
        if (!isEqual(lastElement, action.payload)) {
          state.history.push(action.payload);
        }
      })
      .addCase(popNavigation, (state) => {
        state.history.pop();
      });
  },
});

export const selectNavigationHistory = (state) =>
  state.globalNavigation.history;
export const selectNavigationHistoryLastItem = (state) =>
  last(state.globalNavigation.history);

function updateDocumentTitle(title) {
  if (title && isString(title)) document.title = title;
}

export const services = [
  {
    id: "global/navigation/updateTitle",
    effect: (_, __, { title }) => {
      updateDocumentTitle(title);
    },
    action: ({ title } = {}) => {
      updateDocumentTitle(title);
    },
  },
];

export default navigationSlice.reducer;
