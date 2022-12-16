import {
  loadRecordDrafts,
  saveRecordDraft,
  selectUserDraftById,
  selectUserDrafts,
} from "./recordsDraftsSlice";

export const recordsDrafts = {
  load: loadRecordDrafts,
  save: saveRecordDraft,
  selectByUser: selectUserDrafts,
  selectById: selectUserDraftById,
};
