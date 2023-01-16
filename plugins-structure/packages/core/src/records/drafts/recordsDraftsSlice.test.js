import reducer, {
  RECORD_DRAFT_LS_KEY,
  deleteRecordDraft,
  initialState,
  loadRecordDrafts,
  saveRecordDraft,
} from "./recordsDraftsSlice";
import * as localStorage from "../../localStorage/localStorage";
import { configureStore } from "@reduxjs/toolkit";

const draft = {
  record: { files: [] },
  userid: "fake-id",
  draftid: "fake-draft",
};

describe("Given recordsDraftsSlice", () => {
  let store, getFromLocalStorageSpy, saveToLocalStorageSpy;
  beforeEach(() => {
    // mock and re-create the store before each test
    store = configureStore({ reducer });
    getFromLocalStorageSpy = jest.spyOn(localStorage, "getFromLocalStorage");
    saveToLocalStorageSpy = jest.spyOn(localStorage, "saveToLocalStorage");
    jest.spyOn(Date, "now").mockReturnValue(1000 * 1000);
  });
  afterEach(() => {
    getFromLocalStorageSpy.mockRestore();
    saveToLocalStorageSpy.mockRestore();
  });

  describe("when empty params", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("when dispatching saveRecordDraft", () => {
    it("should save new draft successfully on localStorage", () => {
      store.dispatch(saveRecordDraft(draft));
      // Should get current drafts and then save the new one.
      expect(getFromLocalStorageSpy).toBeCalledWith(
        RECORD_DRAFT_LS_KEY,
        draft.userid
      );
      expect(saveToLocalStorageSpy).toBeCalledWith(
        RECORD_DRAFT_LS_KEY,
        { [draft.draftid]: { record: draft.record, timestamp: 1000 } },
        draft.userid
      );
    });
    it("should fail with falsy params", () => {
      expect(() => store.dispatch(saveRecordDraft(undefined))).toThrow();
      expect(() => store.dispatch(saveRecordDraft(null))).toThrow();
    });
  });

  describe("when dispatching deleteRecordDraft", () => {
    const { userid, draftid } = draft;
    const userDrafts = { [draftid]: draft };
    const preloadedState = { byUserId: { [userid]: userDrafts } };
    beforeEach(() => {
      store = configureStore({ reducer, preloadedState });
      // mock localstorage so we can have drafts to delete
      getFromLocalStorageSpy.mockReturnValue({ [draftid]: draft });
    });
    it("should remove drafts and save list to localStorage", () => {
      store.dispatch(deleteRecordDraft({ userid, draftid }));
      // calls localStorage to save the list without the deleted draft.
      const callParams = [RECORD_DRAFT_LS_KEY, {}, userid];
      expect(saveToLocalStorageSpy).toBeCalledWith(...callParams);
      // user has no drafts
      expect(store.getState().byUserId[userid]).toEqual({});
      expect(store.getState().byUserId[userid][draftid]).toBeUndefined();
    });
    it("shouldn't change list when draft does not exist", () => {
      store.dispatch(deleteRecordDraft({ userid, draftid: "nomatch" }));
      // save is not called, since there's no matching draft to delete
      expect(saveToLocalStorageSpy).not.toBeCalled();
      // no state changes.
      expect(store.getState()).toEqual(preloadedState);
    });
  });

  describe("when dispatching loadRecordDrafts", () => {
    const drafts = { [draft.draftid]: draft };
    beforeEach(() => {
      getFromLocalStorageSpy.mockReturnValue(drafts);
    });
    it("should populate state with localStorage drafts content", () => {
      store.dispatch(loadRecordDrafts(draft.userid));
      expect(store.getState().byUserId[draft.userid]).toEqual(drafts);
    });
  });
});
