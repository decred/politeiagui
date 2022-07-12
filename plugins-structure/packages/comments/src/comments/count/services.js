import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsCountsPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchNextCommentsCount } from "./effects";

export const services = [
  {
    id: "comments/count",
    action: async () => {
      await fetchPolicyIfIdle();
      validateCommentsCountsPageSize(store.getState());
    },
    effect: fetchNextCommentsCount,
  },
];
