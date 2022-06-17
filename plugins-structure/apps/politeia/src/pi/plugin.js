import { pluginSetup } from "@politeiagui/core";
import { initializers } from "./initializers";
import policyReducer from "./policy/policySlice";
import summariesReducer from "./summaries/summariesSlice";

// Declare pi plugin interface
const PiPlugin = pluginSetup({
  initializers,
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
