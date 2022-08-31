import { fetchApi, selectApi, selectApiStatus } from "./apiSlice";

export const api = {
  select: selectApi,
  selectStatus: selectApiStatus,
  fetch: fetchApi,
};
