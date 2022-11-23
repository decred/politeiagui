import { createSliceServices } from "@politeiagui/core/toolkit";
import { fetchPolicyIfIdle } from "../utils";
import {
  fetchRecordsBillingStatusChanges,
  fetchSingleRecordBillingStatusChanges,
} from "./effects";

async function onSetup() {
  await fetchPolicyIfIdle();
}

export const services = [
  {
    id: "pi/billingStatusChanges/single",
    action: async () => {
      await fetchPolicyIfIdle();
    },
    effect: fetchSingleRecordBillingStatusChanges,
  },
  {
    id: "pi/billingStatusChanges",
    action: async () => {
      await fetchPolicyIfIdle();
    },
    effect: fetchRecordsBillingStatusChanges,
  },
];

export const sliceServices = createSliceServices({
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
