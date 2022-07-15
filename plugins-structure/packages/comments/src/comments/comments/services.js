import { fetchPolicyIfIdle } from "../utils";
import { validateCommentsVotesPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { fetchRecordComments } from "./effects";

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
