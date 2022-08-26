import {
  fetchTicketvoteDetails,
  selectTicketvoteDetailsByToken,
  selectTicketvoteDetailsError,
  selectTicketvoteDetailsStatus,
} from "./detailsSlice";

export const ticketvoteDetails = {
  fetch: fetchTicketvoteDetails,
  selectError: selectTicketvoteDetailsError,
  selectStatus: selectTicketvoteDetailsStatus,
  selectByToken: selectTicketvoteDetailsByToken,
};
