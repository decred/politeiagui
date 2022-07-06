import { pluginSetup } from "@politeiagui/core";
import { services } from "./services";
import policyReducer from "./policy/policySlice";
import summariesReducer from "./summaries/summariesSlice";

// Declare pi plugin interface
const PiPlugin = pluginSetup({
  services,
  reducers: [
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
