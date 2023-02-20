import {
  // Records
  RECORDS_API_ROUTE,
  ROUTE_DETAILS,
  ROUTE_INVENTORY,
  ROUTE_POLICY,
  ROUTE_RECORDS,
  ROUTE_RECORDS_USER_INVENTORY,
  ROUTE_TIMESTAMPS,
  ROUTE_USER_CREDITS,
  // Users
  ROUTE_USER_DETAILS,
  ROUTE_USER_EDIT,
  ROUTE_USER_EMAIL_VERIFY,
  ROUTE_USER_LOGIN,
  ROUTE_USER_LOGOUT,
  ROUTE_USER_MANAGE,
  ROUTE_USER_ME,
  ROUTE_USER_NEW,
  ROUTE_USER_PAYMENTS_RESCAN,
  ROUTE_USER_PAYWALL,
  ROUTE_WWW_POLICY,
  USER_API_ROUTE,
  WWW_API_ROUTE,
} from "./constants";
import qs from "querystring";
import { generatePath } from "../router/helpers";

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

// Records API client
/**
 * fetchRecordsInventory fetches the records inventory for given records state
 * and status. Page is optional and defaults to 1.
 * @param {{
 *  recordsState: Number,
 *  status: Number,
 *  page?: Number
 * }} options
 * @returns
 */
async function fetchRecordsInventory({ recordsState, status, page = 1 }) {
  const response = await fetch(
    `${RECORDS_API_ROUTE}${VERSION}${ROUTE_INVENTORY}`,
    fetchOptions(null, { state: recordsState, status, page }, "POST")
  );
  const inventory = await parseResponse(response);
  return inventory;
}

async function fetchRecordsUserInventory({ userid }) {
  const response = await fetch(
    `${RECORDS_API_ROUTE}${VERSION}${ROUTE_RECORDS_USER_INVENTORY}`,
    fetchOptions(null, { userid }, "POST")
  );
  const inventory = await parseResponse(response);
  return inventory;
}

/**
 * fetchRecords fetches records for given records tokens batch and files names.
 *
 * @param {Object} state redux state
 * @param {String[]} records records tokens arrray
 * @param {String[]} filenames files names array
 */
async function fetchRecords(state, records, filenames) {
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
}

/**
 * fetchRecordDetails fetches record details for given record token.
 *
 * @param {Object} state redux state
 * @param {{ token: String, version: Number }} params record token and version
 */
async function fetchRecordDetails(state, { token, version }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${RECORDS_API_ROUTE}${VERSION}${ROUTE_DETAILS}`,
    fetchOptions(csrf, { token, version }, "POST")
  );
  const recordResponse = await parseResponse(response);
  return recordResponse.record;
}

/**
 * fetchRecordTimestamps fetches record timestamps for given record token and
 * version.
 *
 * @param {Object} state redux state
 * @param {{ token: String, version: Number }} params record token and version
 */
async function fetchRecordTimestamps(state, { token, version }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${RECORDS_API_ROUTE}${VERSION}${ROUTE_TIMESTAMPS}`,
    fetchOptions(csrf, { token, version }, "POST")
  );
  return await parseResponse(response);
}

/**
 * fetchRecordsPolicy fetches the records API policy.
 *
 * @param {Object} state redux state
 */
async function fetchRecordsPolicy(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${RECORDS_API_ROUTE}${VERSION}${ROUTE_POLICY}`,
    fetchOptions(csrf, {}, "POST")
  );
  return await parseResponse(response);
}

// WWW Api client
/**
 * fetchApi fetches the api information, and a new csrf token.
 *
 */
async function fetchApi() {
  const response = await fetch("/api");
  const api = await parseResponse(response);
  const csrf = response.headers.get("X-Csrf-Token");
  return { api, csrf };
}

/**
 * getCsrf returns the csrf token from the state, if it doesn't exist, it calls
 * client's `fetchApi` to get it.
 *
 * @param {Object} state redux state
 * @returns {String} csrf token
 */
export async function getCsrf(state) {
  const csrf = state.api && state.api.csrf;
  // if already has csrf just return it
  if (csrf) return csrf;
  // otherwise, call fetchApi to get it
  const { csrf: newCsrf } = await client.fetchApi();
  return newCsrf;
}

async function fetchWWWPolicy() {
  const response = await fetch(`${WWW_API_ROUTE}${VERSION}${ROUTE_WWW_POLICY}`);
  return await parseResponse(response);
}

// User API client
/**
 * userFetchMe fetches the user that has an active session.
 *
 * @param {Object} state redux state
 */
async function userFetchMe(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_ME}`,
    fetchOptions(csrf, null, "GET")
  );
  return await parseResponse(response);
}

/**
 * userLogin logs in the user. It also renews the csrf token so user session
 * duration matches the csrf token duration.
 *
 * @param {{
 *  email: String,
 *  password: String,
 *  code?: String
 * }} credentials
 */
async function userLogin({ email, password, code }) {
  const { csrf } = await fetchApi();
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_LOGIN}`,
    fetchOptions(csrf, { email, password, code }, "POST")
  );
  return await parseResponse(response);
}

/**
 * userLogout logs out the currently logged in user.
 *
 * @param {Object} state redux state
 */
async function userLogout(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_LOGOUT}`,
    fetchOptions(csrf, {}, "POST")
  );
  return await parseResponse(response);
}

/**
 * userSignup signs up a new user.
 *
 * @param {Object} state redux state
 * @param {{
 *  email: String,
 *  password: String,
 *  username: String,
 *  publickey: String
 * }} credentials
 */
async function userSignup(state, { email, password, username, publickey }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_NEW}`,
    fetchOptions(csrf, { email, password, username, publickey }, "POST")
  );
  return await parseResponse(response);
}

/**
 * userVerifyEmail verifies the user account email.
 *
 * @param {{
 * verificationtoken: String,
 * email: String,
 * signature: String
 * }} params verification token, email and signature for the verification token
 */
async function userVerifyEmail({ verificationtoken, email, signature }) {
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_EMAIL_VERIFY}?${toQueryString({
      verificationtoken,
      email,
      signature,
    })}`
  );
  return await parseResponse(response);
}

/**
 * userFetchDetails fetches the user details for given userid.
 * @param {{ userid: String }} params userid
 */
async function userFetchDetails({ userid }) {
  const route = generatePath(ROUTE_USER_DETAILS, { userid });
  const response = await fetch(`${USER_API_ROUTE}${VERSION}${route}`);
  return await parseResponse(response);
}

/**
 * userManage manages the user account for given userid. Action defines the
 * action to be performed on the user account. Reason defines the reason for
 * the action.
 * @param {Object} state redux state
 * @param {{
 *  action: String,
 *  reason: String,
 *  userid: String
 * }} params action, reason and userid
 */
async function userManage(state, { action, reason, userid }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_MANAGE}`,
    fetchOptions(csrf, { action, reason, userid }, "POST")
  );
  return await parseResponse(response);
}

/**
 * userEdit edits the user account preferences. Preferences are defined by the
 * emailnotifications configuration.
 *
 * @param {Object} state redux state
 * @param {{ emailnotifications: Number }} params emailnotifications
 */
async function userEdit(state, { emailnotifications }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_EDIT}`,
    fetchOptions(csrf, { emailnotifications }, "POST")
  );
  return await parseResponse(response);
}

/**
 * userPaywall fetches the user paywall information.
 *
 * @param {Object} state redux state
 */
async function userPaywall(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_PAYWALL}`,
    fetchOptions(csrf, null, "GET")
  );
  return await parseResponse(response);
}

/**
 * userCredits fetches the logged in user user credits information.
 *
 * @param {Object} state redux state
 */
async function userCredits(state) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_CREDITS}`,
    fetchOptions(csrf, null, "GET")
  );
  return await parseResponse(response);
}

async function userPaymentsRescan(state, { userid }) {
  const csrf = await getCsrf(state);
  const response = await fetch(
    `${USER_API_ROUTE}${VERSION}${ROUTE_USER_PAYMENTS_RESCAN}`,
    fetchOptions(csrf, { userid }, "PUT")
  );
  return await parseResponse(response);
}

// export client object with functions to interact with the API
export const client = {
  // Records API
  fetchRecordsInventory,
  fetchRecordsUserInventory,
  fetchRecords,
  fetchRecordDetails,
  fetchRecordTimestamps,
  fetchRecordsPolicy,
  // WWW API
  fetchApi,
  fetchWWWPolicy,
  // User API
  userFetchDetails,
  userFetchMe,
  userLogin,
  userLogout,
  userEdit,
  userManage,
  userSignup,
  userVerifyEmail,
  // User Payments API,
  userCredits,
  userPaywall,
  userPaymentsRescan,
};

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
  // Prevent json payload from being sent if it's empty
  if (json) {
    return {
      headers: csrf ? headersWithCsrf : headers,
      credentials: "include", // Include cookies
      method,
      body: JSON.stringify(json),
    };
  }
  return {
    headers: csrf ? headersWithCsrf : headers,
    credentials: "include", // Include cookies
    method,
  };
}

export function toQueryString(params) {
  return qs.stringify(params);
}
