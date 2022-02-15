import {
  COMMENTS_API_ROUTE,
  ROUTE_COMMENTS,
  ROUTE_COUNT,
  ROUTE_POLICY,
  ROUTE_TIMESTAMPS,
  ROUTE_VOTES,
  VERSION,
} from "./constants";
import { fetchOptions, getCsrf, parseResponse } from "@politeiagui/core/client";

function getCommentsRoute(route) {
  return `${COMMENTS_API_ROUTE}${VERSION}${route}`;
}

export async function fetchComments(state, { token }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getCommentsRoute(ROUTE_COMMENTS),
    fetchOptions(csrf, { token }, "POST")
  );
  const commentsResponse = await parseResponse(response);
  return commentsResponse.comments;
}

export async function fetchCount(state, { tokens }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getCommentsRoute(ROUTE_COUNT),
    fetchOptions(csrf, { tokens }, "POST")
  );
  const parsedResponse = await parseResponse(response);
  return parsedResponse.counts;
}

export async function fetchPolicy(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getCommentsRoute(ROUTE_POLICY),
    fetchOptions(csrf, {}, "POST")
  );
  return await parseResponse(response);
}

export async function fetchVotes(state, { token, userid }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getCommentsRoute(ROUTE_VOTES),
    fetchOptions(csrf, { token, userid }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchTimestamps(state, { token, commentids }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    getCommentsRoute(ROUTE_TIMESTAMPS),
    fetchOptions(csrf, { token, commentids }, "POST")
  );
  return await parseResponse(response);
}
