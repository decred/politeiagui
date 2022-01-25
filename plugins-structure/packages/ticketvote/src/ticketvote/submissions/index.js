import {
  fetchTicketvoteSubmissions,
  selectTicketvoteSubmissions,
  selectTicketvoteSubmissionsByToken,
  selectTicketvoteSubmissionsError,
  selectTicketvoteSubmissionsStatus,
} from "./submissionsSlice";

import { useTicketvoteSubmissions } from "./useSubmissions";

export const ticketvoteSubmissions = {
  fetch: fetchTicketvoteSubmissions,
  selectAll: selectTicketvoteSubmissions,
  selectError: selectTicketvoteSubmissionsError,
  selectByToken: selectTicketvoteSubmissionsByToken,
  selectStatus: selectTicketvoteSubmissionsStatus,
  useFetch: useTicketvoteSubmissions,
};
