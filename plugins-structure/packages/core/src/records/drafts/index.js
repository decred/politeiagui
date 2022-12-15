import {
  loadRecordDrafts,
  saveRecordDraft,
  selectUserDrafts,
} from "./recordsDraftsSlice";

export const recordsDrafts = {
  load: loadRecordDrafts,
  save: saveRecordDraft,
  selectUserDrafts,
};
