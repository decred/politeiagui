import {
  fetchPiPolicy,
  fetchPiSummaries,
  selectPiPolicy,
  selectPiSummaries,
  selectPiSummariesByToken,
} from "./piSlice";

export const piSummaries = {
  fetch: fetchPiSummaries,
  selectByToken: selectPiSummariesByToken,
  selectAll: selectPiSummaries,
};

export const piPolicy = {
  fetch: fetchPiPolicy,
  selectAll: selectPiPolicy,
};
