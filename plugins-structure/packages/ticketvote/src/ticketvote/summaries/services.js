import {
  fetchAllTicketvoteSummaries,
  fetchNextTicketvoteSummaries,
  fetchRecordTicketvoteSummaries,
} from "./effects";
import { fetchPolicyIfIdle } from "../utils";
import { validateTicketvoteSummariesPageSize } from "../../lib/validation";
import { store } from "@politeiagui/core";
import { createSliceServices } from "@politeiagui/core/toolkit";

async function onSetup() {
  await fetchPolicyIfIdle();
  validateTicketvoteSummariesPageSize(store.getState());
}

// TODO: remove this
export const services = [
  {
    id: "ticketvote/summaries/batch",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteSummariesPageSize(store.getState());
    },
    effect: fetchNextTicketvoteSummaries,
  },
  {
    id: "ticketvote/summaries/single",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteSummariesPageSize(store.getState());
    },
    effect: fetchRecordTicketvoteSummaries,
  },
  {
    id: "ticketvote/summaries/all",
    action: async () => {
      await fetchPolicyIfIdle();
      validateTicketvoteSummariesPageSize(store.getState());
    },
    effect: fetchAllTicketvoteSummaries,
  },
];

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "ticketvoteSummaries",
  services: {
    batch: { onSetup, effect: fetchNextTicketvoteSummaries },
    single: { onSetup, effect: fetchRecordTicketvoteSummaries },
    all: { onSetup, effect: fetchAllTicketvoteSummaries },
  },
});
