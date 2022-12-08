import { createSliceServices } from "@politeiagui/core/toolkit";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchRecordsBillingStatusChanges,
  fetchSingleRecordBillingStatusChanges,
} from "./effects";

async function onSetup() {
  await fetchPolicyIfIdle();
}

export const { pluginServices, serviceListeners } = createSliceServices({
  name: "piBilling",
  services: {
    statusChanges: {
      onSetup,
      effect: fetchRecordsBillingStatusChanges,
    },
    statusChangesSingle: {
      onSetup,
      effect: fetchSingleRecordBillingStatusChanges,
    },
  },
});
