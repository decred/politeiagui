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

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "ticketvoteSummaries",
  services: {
    batch: { onSetup, effect: fetchNextTicketvoteSummaries },
    single: { onSetup, effect: fetchRecordTicketvoteSummaries },
    all: { onSetup, effect: fetchAllTicketvoteSummaries },
  },
});
