import { pluginServices as summariesServices } from "./summaries/services";
import { pluginServices as billingServices } from "./billing/services";
import { pluginServices as proposalsServices } from "./proposals/services";
import { pluginServices as policyServices } from "./policy/services";

export const services = [
  ...billingServices,
  ...summariesServices,
  ...proposalsServices,
  ...policyServices,
];
