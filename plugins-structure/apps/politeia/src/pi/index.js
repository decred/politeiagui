import policyReducer from "./policy/policySlice";
import summariesReducer from "./summaries/summariesSlice";

export * from "./constants";
export { piPolicy } from "./policy";
export { piSummaries } from "./summaries";

export const reducersArray = [
  {
    key: "piPolicy",
    reducer: policyReducer,
  },
  {
    key: "piSummaries",
    reducer: summariesReducer,
  },
];
