import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsTimestampsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchRecordCommentsTimestampsEffect } from "./effects";

export const services = [
  {
    id: "comments/timestamps",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsTimestampsPageSize(store.getState());
    },
    effect: fetchRecordCommentsTimestampsEffect,
  },
];
