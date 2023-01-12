import { fetchPolicyIfIdle } from "./utils";
import { pluginServices as summariesServices } from "./summaries/services";
import { pluginServices as billingServices } from "./billing/services";
import { pluginServices as proposalsServices } from "./proposals/services";

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
