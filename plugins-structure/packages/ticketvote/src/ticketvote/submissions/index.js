import {
  fetchTicketvoteSubmissions,
  selectTicketvoteSubmissions,
  selectTicketvoteSubmissionsByToken,
  selectTicketvoteSubmissionsError,
  selectTicketvoteSubmissionsStatus,
} from "./submissionsSlice";

export const ticketvoteSubmissions = {
  fetch: fetchTicketvoteSubmissions,
  selectAll: selectTicketvoteSubmissions,
  selectError: selectTicketvoteSubmissionsError,
  selectByToken: selectTicketvoteSubmissionsByToken,
  selectStatus: selectTicketvoteSubmissionsStatus,
};
