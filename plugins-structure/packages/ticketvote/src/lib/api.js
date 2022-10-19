import {
  ROUTE_DETAILS,
  ROUTE_INVENTORY,
  ROUTE_POLICY,
  ROUTE_RESULTS,
  ROUTE_SUBMISSIONS,
  ROUTE_SUMMARIES,
  ROUTE_TIMESTAMPS,
  TICKETVOTE_API_ROUTE,
  VERSION
} from "./constants";
import { fetchOptions, getCsrf, parseResponse } from "@politeiagui/core/client";

function getTicketvoteRoute(route) {
  return `${TICKETVOTE_API_ROUTE}${VERSION}${route}`;
}

export async function fetchDetails(state, { token }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_DETAILS),
    fetchOptions(csrf, { token }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchInventory(state, { status, page }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_INVENTORY),
    fetchOptions(csrf, { status, page }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchTicketvotePolicy(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_POLICY),
    fetchOptions(csrf, {}, "POST")
  );
  return await parseResponse(response);
}

export async function fetchResults(state, { token }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_RESULTS),
    fetchOptions(csrf, { token }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchSubmissions(state, { token }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_SUBMISSIONS),
    fetchOptions(csrf, { token }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchSummaries(state, { tokens }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_SUMMARIES),
    fetchOptions(csrf, { tokens }, "POST")
  );
  const summariesInfo = await parseResponse(response);
  return summariesInfo.summaries;
}

export async function fetchTimestamps(state, { token, votespage }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getTicketvoteRoute(ROUTE_TIMESTAMPS),
    fetchOptions(csrf, { token, votespage }, "POST")
  );
  return await parseResponse(response);
}
