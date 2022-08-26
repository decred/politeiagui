import {
  fetchTicketvoteResults,
  selectTicketvoteResultsByToken,
  selectTicketvoteResultsError,
  selectTicketvoteResultsStatus,
} from "./resultsSlice";

export const ticketvoteResults = {
  fetch: fetchTicketvoteResults,
  selectByToken: selectTicketvoteResultsByToken,
  selectError: selectTicketvoteResultsError,
  selectStatus: selectTicketvoteResultsStatus,
};
