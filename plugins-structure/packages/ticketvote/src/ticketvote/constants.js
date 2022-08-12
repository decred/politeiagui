import details from "./details/detailsSlice";
import inventory from "./inventory/inventorySlice";
import policy from "./policy/policySlice";
import results from "./results/resultsSlice";
import summaries from "./summaries/summariesSlice";
import submissions from "./submissions/submissionsSlice";
import timestamps from "./timestamps/timestampsSlice";

export const reducersArray = [
  {
    key: "ticketvoteDetails",
    reducer: details,
  },
  {
    key: "ticketvoteInventory",
    reducer: inventory,
  },
  {
    key: "ticketvotePolicy",
    reducer: policy,
  },
  {
    key: "ticketvoteResults",
    reducer: results,
  },
  {
    key: "ticketvoteSubmissions",
    reducer: submissions,
  },
  {
    key: "ticketvoteSummaries",
    reducer: summaries,
  },
  {
    key: "ticketvoteTimestamps",
    reducer: timestamps,
  },
];
