import {
  fetchTicketvoteResults,
  selectTicketvoteResultsByToken,
  selectTicketvoteResultsError,
  selectTicketvoteResultsStatus,
} from "./resultsSlice";

import { useTicketvoteResults } from "./useResults";

export const ticketvoteResults = {
  fetch: fetchTicketvoteResults,
  selectByToken: selectTicketvoteResultsByToken,
  selectError: selectTicketvoteResultsError,
  selectStatus: selectTicketvoteResultsStatus,
  useFetch: useTicketvoteResults,
};
