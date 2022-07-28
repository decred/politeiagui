import { fetchPolicyIfIdle } from "./utils";
import { services as summariesServices } from "./summaries/services";
import { services as billingServices } from "./billing/services";
import { services as proposalsServices } from "./proposals/services";

export const services = [
  ...billingServices,
  ...summariesServices,
  ...proposalsServices,
  {
    id: "pi/new",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
