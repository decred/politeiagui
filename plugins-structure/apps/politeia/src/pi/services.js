import { fetchPolicyIfIdle } from "./utils";
import { services as summariesServices } from "./summaries/services";

export const services = [
  ...summariesServices,
  {
    id: "pi/new",
    action: async () => {
      await fetchPolicyIfIdle();
    },
  },
];
