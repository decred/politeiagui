import {
  fetchPiSummaries,
  selectPiSummaries,
  selectPiSummariesByToken,
  selectPiSummariesByTokensBatch,
  selectPiSummariesStatus,
} from "./summariesSlice";

export const piSummaries = {
  fetch: fetchPiSummaries,
  selectAll: selectPiSummaries,
  selectByToken: selectPiSummariesByToken,
  selectByTokensBatch: selectPiSummariesByTokensBatch,
  selectStatus: selectPiSummariesStatus,
};
