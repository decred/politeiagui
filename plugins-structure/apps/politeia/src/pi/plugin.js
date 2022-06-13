import { Plugin } from "@politeiagui/core";
import { routes } from "./routes";
import policyReducer from "./policy/policySlice";
import summariesReducer from "./summaries/summariesSlice";

// Declare pi plugin interface
const PiPlugin = Plugin({
  routes,
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
