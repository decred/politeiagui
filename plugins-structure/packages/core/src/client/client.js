import { RECORDS_API_ROUTE, ROUTE_INVENTORY, ROUTE_RECORDS } from "./constants";

const filenames = ["proposalmetadata.json", "votemetadata.json"];
const VERSION = "v1";

// export client object with functions to interact with the API
export const client = {
  async fetchRecordsInventory(body) {
    const response = await fetch(
      `${RECORDS_API_ROUTE}${VERSION}${ROUTE_INVENTORY}`,
      fetchOptions(null, body, "POST")
    );
    const inventory = await parseResponse(response);
    return inventory;
  },
  async fetchRecords(state, records) {
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
  async fetchApi() {
    const response = await fetch("/api");
    const csrf = response.headers.get("X-Csrf-Token");
    const api = await parseResponse(response);
    return { api, csrf };
  },
};

// Not exported client utils
async function getCsrf(state) {
  const { csrf } = state.api;
  // if already has csrf just return it
  if (csrf) return csrf;
  // otherwise, call fetchApi to get it
  const { csrf: newCsrf } = await this.fetchApi();
  return newCsrf;
}

async function parseResponse(response) {
  const { status, statusText } = response;
  const json = await response.json();
  if (status === 200) return json;
  throw Error(statusText);
}

function fetchOptions(csrf, json, method) {
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
