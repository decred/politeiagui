import {
  deleteRecordDraft,
  loadRecordDrafts,
  saveRecordDraft,
  selectUserDraftById,
  selectUserDrafts,
} from "./recordsDraftsSlice";

export const recordsDrafts = {
  load: loadRecordDrafts,
  save: saveRecordDraft,
  delete: deleteRecordDraft,
  selectByUser: selectUserDrafts,
  selectById: selectUserDraftById,
};
