import {
  fetchPiSummaries,
  selectPiSummaries,
  selectPiSummariesByToken,
} from "./summariesSlice";

export const piSummaries = {
  fetch: fetchPiSummaries,
  selectAll: selectPiSummaries,
  selectByToken: selectPiSummariesByToken,
};
