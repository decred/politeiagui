import {
  fetchApi,
  selectApi,
  selectApiError,
  selectApiStatus,
} from "./apiSlice";

import {
  fetchApiPolicy,
  selectApiPolicy,
  selectApiPolicyError,
  selectApiPolicyStatus,
} from "./policySlice";

export const api = {
  select: selectApi,
  selectStatus: selectApiStatus,
  fetch: fetchApi,
  selectError: selectApiError,
};

export const apiPolicy = {
  fetch: fetchApiPolicy,
  select: selectApiPolicy,
  selectError: selectApiPolicyError,
  selectStatus: selectApiPolicyStatus,
};
