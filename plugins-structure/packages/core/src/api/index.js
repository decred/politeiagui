import {
  fetchApi,
  selectApi,
  selectApiError,
  selectApiStatus
} from "./apiSlice";

export const api = {
  select: selectApi,
  selectStatus: selectApiStatus,
  fetch: fetchApi,
  selectError: selectApiError
};
