import {
  RECORDS_API_ROUTE,
  ROUTE_DETAILS,
  ROUTE_INVENTORY,
  ROUTE_POLICY,
  ROUTE_RECORDS,
  ROUTE_TIMESTAMPS,
} from "./constants";

const VERSION = "v1";

function ClientError(url) {
  this.message = `Cannot fetch "${url}". Is politeiawww running?`;
}
ClientError.prototype = new Error();

function ApiError(message, body) {
  this.message = message;
  this.body = body;
  this.name = "API Error";
}
ApiError.prototype = new Error();

export function getDefaultErrorMessage(code = 0, api = "") {
  return `
    The server encountered an unexpected error, please contact Politeia
    administrators and inform the api/${api} error code: ${code}
  `;
}

// export client object with functions to interact with the API
export const client = {
  async fetchRecordsInventory(obj) {
    const response = await fetch(
      `${RECORDS_API_ROUTE}${VERSION}${ROUTE_INVENTORY}`,
      fetchOptions(null, obj, "POST")
    );
    const inventory = await parseResponse(response);
    return inventory;
  },
  async fetchRecords(state, records, filenames) {
    if (!state) {
      const error = Error("state is a required parameter");
      console.error(error);
      throw error;
    }
    const csrf = await getCsrf(state);
    const body = {
      requests: records.map((token) => ({
        token,
        filenames,
      })),
    };
    const response = await fetch(
      `${RECORDS_API_ROUTE}${VERSION}${ROUTE_RECORDS}`,
      fetchOptions(csrf, body, "POST")
    );
    const recordsInfo = await parseResponse(response);
    return recordsInfo.records;
  },
  async fetchRecordDetails(state, { token, version }) {
    const csrf = await getCsrf(state);
    const response = await fetch(
      `${RECORDS_API_ROUTE}${VERSION}${ROUTE_DETAILS}`,
      fetchOptions(csrf, { token, version }, "POST")
    );
    const recordResponse = await parseResponse(response);
    return recordResponse.record;
  },
  async fetchRecordTimestamps(state, { token, version }) {
    const csrf = await getCsrf(state);
    const response = await fetch(
      `${RECORDS_API_ROUTE}${VERSION}${ROUTE_TIMESTAMPS}`,
      fetchOptions(csrf, { token, version }, "POST")
    );
    return await parseResponse(response);
  },
  async fetchApi() {
    const response = await fetch("/api");
    const api = await parseResponse(response);
    const csrf = response.headers.get("X-Csrf-Token");
    return { api, csrf };
  },
  async fetchRecordsPolicy(state) {
    const csrf = await getCsrf(state);
    const response = await fetch(
      `${RECORDS_API_ROUTE}${VERSION}${ROUTE_POLICY}`,
      fetchOptions(csrf, {}, "POST")
    );
    return await parseResponse(response);
  },
};

export async function getCsrf(state) {
  const csrf = state.api && state.api.csrf;
  // if already has csrf just return it
  if (csrf) return csrf;
  // otherwise, call fetchApi to get it
  const { csrf: newCsrf } = await client.fetchApi();
  return newCsrf;
}

export async function parseResponse(response) {
  const { status, statusText } = response;
  let json;
  try {
    // Decode response body
    json = await response.json();
  } catch (_) {
    // Response has no JSON body, hence it cannot be decoded.
    const url = new URL(response.url);
    throw new ClientError(url.pathname);
  }
  if (status < 200 || status > 299) {
    throw new ApiError(statusText, json);
  }
  return json;
}

export function fetchOptions(csrf, json, method) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  };
  const headersWithCsrf = {
    ...headers,
    "X-Csrf-Token": csrf,
  };
  return {
    headers: csrf ? headersWithCsrf : headers,
    credentials: "include", // Include cookies
    method,
    body: JSON.stringify(json),
  };
}
