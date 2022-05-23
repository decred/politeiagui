import {
  fetchPiSummaries,
  selectPiSummaries,
  selectPiSummariesByToken,
  selectPiSummariesStatus,
} from "./summariesSlice";

export const piSummaries = {
  fetch: fetchPiSummaries,
  selectAll: selectPiSummaries,
  selectByToken: selectPiSummariesByToken,
  selectStatus: selectPiSummariesStatus,
};
