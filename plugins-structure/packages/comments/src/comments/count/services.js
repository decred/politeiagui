import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsCountsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchAllCommentsCounts, fetchNextCommentsCount } from "./effects";
import { createSliceServices } from "@politeiagui/core/toolkit";

async function onSetup() {
  await fetchPolicyIfIdle();
  validateCommentsCountsPageSize(store.getState());
}

export const services = [
  {
    id: "comments/count",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsCountsPageSize(store.getState());
    },
    effect: fetchNextCommentsCount,
  },
  {
    id: "comments/count/all",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsCountsPageSize(store.getState());
    },
    effect: fetchAllCommentsCounts,
  },
];

export const sliceServices = createSliceServices({
  name: "commentsCount",
  services: {
    fetch: { onSetup, effect: fetchNextCommentsCount },
    fetchAll: { onSetup, effect: fetchAllCommentsCounts },
  },
});
