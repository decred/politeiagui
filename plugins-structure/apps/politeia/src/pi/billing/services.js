import { fetchPolicyIfIdle } from "../utils";
import {
  fetchRecordsBillingStatusChanges,
  fetchSingleRecordBillingStatusChanges,
} from "./effects";

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
