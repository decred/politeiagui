import { createSliceServices } from "../../toolkit/createSliceServices";
import { deleteRecordDraft, loadRecordDrafts } from "./recordsDraftsSlice";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "recordsDrafts",
  services: {
    load: {
      onSetup: ({ dispatch }) => {
        // TODO: Use logged in user id
        const userid = "user-id-test";
        dispatch(loadRecordDrafts(userid));
      },
    },
    delete: {
      effect: (_, dispatch, { draftid }) => {
        // TODO: Use logged in user id
        const userid = "user-id-test";
        dispatch(deleteRecordDraft({ userid, draftid }));
      },
    },
  },
});
