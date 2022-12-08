import { store } from "@politeiagui/core";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchAllRecordsPiSummaries,
  fetchRecordsPiSummaries,
  fetchSingleRecordPiSummaries,
} from "./effects";
import { validatePiSummariesPageSize } from "../lib/validation";
import { createSliceServices } from "@politeiagui/core/toolkit";

async function onSetup() {
  await fetchPolicyIfIdle();
  validatePiSummariesPageSize(store.getState());
}

export const { pluginServices, serviceSetups } = createSliceServices({
  name: "piSummaries",
  services: {
    all: { onSetup, effect: fetchAllRecordsPiSummaries },
    batch: { onSetup, effect: fetchRecordsPiSummaries },
    single: { onSetup, effect: fetchSingleRecordPiSummaries },
  },
});
