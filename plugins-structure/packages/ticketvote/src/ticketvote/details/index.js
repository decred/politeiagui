import {
  fetchTicketvoteDetails,
  selectTicketvoteDetailsError,
  selectTicketvoteDetailsStatus,
  selectTicketvoteDetailsByToken,
} from "./detailsSlice";

export const ticketvoteDetails = {
  fetch: fetchTicketvoteDetails,
  selectError: selectTicketvoteDetailsError,
  selectStatus: selectTicketvoteDetailsStatus,
  selectByToken: selectTicketvoteDetailsByToken,
};
