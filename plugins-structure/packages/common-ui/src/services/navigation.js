import { createAction, createSlice } from "@reduxjs/toolkit";
import last from "lodash/last";
import isEqual from "lodash/isEqual";

const initialState = {
  history: [],
};

export const pushNavigation = createAction("uiNavigation/push");
export const popNavigation = createAction("uiNavigation/pop");

const navigationSlice = createSlice({
  name: "uiNavigation",
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

export const selectNavigationHistory = (state) => state.uiNavigation?.history;
export const selectNavigationHistoryLastItem = (state) =>
  last(state.uiNavigation?.history);

export default navigationSlice.reducer;
