import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../localStorage/localStorage";

const RECORD_DRAFT_LS_KEY = "records-drafts";

export const initialState = {
  byUserId: {},
};

// Actions
export const loadRecordDrafts = createAction("recordsDrafts/load", (userid) => {
  const drafts = getFromLocalStorage(RECORD_DRAFT_LS_KEY, userid);
  return { payload: { drafts, userid } };
});

export const saveRecordDraft = createAction(
  "recordsDrafts/save",
  ({ record, userid, draftid = nanoid() }) => {
    const drafts = getFromLocalStorage(RECORD_DRAFT_LS_KEY, userid);
    saveToLocalStorage(
      RECORD_DRAFT_LS_KEY,
      {
        ...(drafts || {}),
        [draftid]: { record, timestamp: Math.floor(Date.now() / 1000) },
      },
      userid
    );
    return { payload: { record, draftid, userid } };
  }
);

export const deleteRecordDraft = createAction(
  "recordsDrafts/delete",
  ({ userid, draftid }) => {
    const drafts = getFromLocalStorage(RECORD_DRAFT_LS_KEY, userid);
    delete drafts[draftid];
    saveToLocalStorage(RECORD_DRAFT_LS_KEY, drafts, userid);
    return { payload: { draftid } };
  }
);

const recordsDraftsSlice = createSlice({
  name: "recordsDrafts",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(loadRecordDrafts, (state, action) => {
        const { userid, drafts } = action.payload;
        state.byUserId[userid] = drafts;
      })
      .addCase(saveRecordDraft, (state, action) => {
        const { userid, draftid, record } = action.payload;
        state.byUserId[userid] = {
          ...(state.byUserId[userid] || {}),
          [draftid]: record,
        };
      });
  },
});

// Selectors
export const selectUserDrafts = (state, userid) =>
  state.recordsDrafts.byUserId[userid];
export const selectUserDraftById = (state, { draftid, userid }) => {
  return state.recordsDrafts.byUserId[userid]?.[draftid];
};

export default recordsDraftsSlice.reducer;
