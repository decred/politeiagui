import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsVotesPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchRecordComments } from "./effects";
import { createSliceServices } from "@politeiagui/core/toolkit";

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "comments",
  services: {
    fetch: {
      onSetup: async () => {
        await fetchPolicyIfIdle();
        validateCommentsVotesPageSize(store.getState());
      },
      effect: fetchRecordComments,
    },
  },
});
