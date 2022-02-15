import { fetchApi, selectApi, selectApiStatus } from "./apiSlice";
import { useFetchApi } from "./useFetchApi";
export const api = {
  select: selectApi,
  selectStatus: selectApiStatus,
  fetch: fetchApi,
  useFetch: useFetchApi,
};
