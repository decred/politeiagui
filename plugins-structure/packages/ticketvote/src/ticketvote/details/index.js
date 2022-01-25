import {
  fetchTicketvoteDetails,
  selectTicketvoteDetailsError,
  selectTicketvoteDetailsStatus,
  selectTicketvoteDetailsByToken,
} from "./detailsSlice";
import { useTicketvoteDetails } from "./useDetails";

export const ticketvoteDetails = {
  fetch: fetchTicketvoteDetails,
  selectError: selectTicketvoteDetailsError,
  selectStatus: selectTicketvoteDetailsStatus,
  selectByToken: selectTicketvoteDetailsByToken,
  useFetch: useTicketvoteDetails,
};
