import { fetchPolicyIfIdle } from "./utils";
import { services as summariesServices } from "./summaries/services";
import { services as billingServices } from "./billing/services";

export const services = [
  ...billingServices,
  ...summariesServices,
  {
    id: "pi/new",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
