import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsVotesPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchRecordComments } from "./effects";
import { createSliceServices } from "@politeiagui/core/toolkit";

export const services = [
  {
    id: "comments",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsVotesPageSize(store.getState());
    },
    effect: fetchRecordComments,
  },
];

export const sliceServices = createSliceServices({
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
