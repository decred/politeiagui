import { pluginSetup } from "@politeiagui/core";
import { services } from "./services";
import policyReducer from "./policy/policySlice";
import summariesReducer from "./summaries/summariesSlice";
import billingReducer from "./billing/billingSlice";

// Declare pi plugin interface
const PiPlugin = pluginSetup({
  services,
  reducers: [
    {
      key: "piBilling",
      reducer: billingReducer,
    },
    {
      key: "piPolicy",
      reducer: policyReducer,
    },
    {
      key: "piSummaries",
      reducer: summariesReducer,
    },
  ],
  name: "pi",
});

export default PiPlugin;
