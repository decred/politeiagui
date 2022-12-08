import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsCountsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchAllCommentsCounts, fetchNextCommentsCount } from "./effects";
import { createSliceServices } from "@politeiagui/core/toolkit";

async function onSetup() {
  await fetchPolicyIfIdle();
  validateCommentsCountsPageSize(store.getState());
}

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "commentsCount",
  services: {
    fetch: { onSetup, effect: fetchNextCommentsCount },
    all: { onSetup, effect: fetchAllCommentsCounts },
  },
});
