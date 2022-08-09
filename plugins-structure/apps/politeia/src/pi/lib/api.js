import { fetchOptions, getCsrf, parseResponse } from "@politeiagui/core/client";
import {
  PI_API_ROUTE,
  ROUTE_BILLING_STATUS_CHANGES,
  ROUTE_POLICY,
  ROUTE_SUMMARIES,
  VERSION,
} from "./constants";

export async function fetchSummaries(state, { tokens }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${PI_API_ROUTE}${VERSION}${ROUTE_SUMMARIES}`,
    fetchOptions(csrf, { tokens }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchPolicy(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${PI_API_ROUTE}${VERSION}${ROUTE_POLICY}`,
    fetchOptions(csrf, {}, "POST")
  );
  return await parseResponse(response);
}

export async function fetchBillingStatusChanges(state, { tokens }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${PI_API_ROUTE}${VERSION}${ROUTE_BILLING_STATUS_CHANGES}`,
    fetchOptions(csrf, { tokens }, "POST")
  );
  return await parseResponse(response);
}
