import {
  COMMENTS_API_ROUTE,
  VERSION,
  ROUTE_COMMENTS,
  ROUTE_VOTE,
  ROUTE_VOTES,
  ROUTE_NEW,
  ROUTE_COUNT,
  ROUTE_DEL,
  ROUTE_TIMESTAMPS,
} from "./constants";
import { getCsrf, parseResponse, fetchOptions } from "@politeiagui/core/client";

function getCommentsRoute(route) {
  return `${COMMENTS_API_ROUTE}${VERSION}${route}`;
}

export async function fetchComments({ token }) {
  const response = await fetch(
    getCommentsRoute(ROUTE_COMMENTS),
    fetchOptions(null, { token }, "POST")
  );
  return await parseResponse(response);
}

export async function fetchCount({ tokens }) {
  const response = await fetch(
    getCommentsRoute(ROUTE_COUNT),
    fetchOptions(null, { tokens }, "POST")
  );
  return await parseResponse(response);
}
