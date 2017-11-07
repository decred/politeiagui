import "isomorphic-fetch";
import CryptoJS from "crypto-js";
import {
  getHumanReadableError,
  base64ToArrayBuffer,
  arrayBufferToWordArray
} from "../helpers";

const apiBase = "/api";
const getUrl = (path, version = "v1") => `${apiBase}/${version}${path}`;

const parseResponseBody = response => {
  var contentType = response.headers.get("content-type");
  if(contentType && contentType.includes("application/json")) {
    return response.json();
  }

  if (response.status === 400) {
    throw new Error("Bad response from server");
  }

  if (response.status === 401) {
    throw new Error("Not authorized");
  }

  if (response.status === 403) {
    throw new Error("Forbidden");
  }

  if (response.status === 404) {
    throw new Error("Not found");
  }

  throw new Error("Internal server error");
};

const parseResponse = response => parseResponseBody(response)
  .then(json => {
    if (json.errorcode) {
      throw new Error(getHumanReadableError(json.errorcode, json.errorcontext));
    }

    return {
      response: json,
      csrfToken: response.headers.get("X-Csrf-Token")
    };
  });

const get = path =>
  fetch(apiBase + path, {
    credentials: "same-origin"
  });

const post = (path, csrf, json, method = "POST") =>
  fetch(getUrl(path), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Csrf-Token": csrf
    },
    credentials: "include", // Include cookies
    method,
    body: JSON.stringify(json)
  });

export const me = () =>
  get("/v1/user/me")
    .then(parseResponse)
    .then(({ csrfToken, response: { email, isadmin } }) => ({
      csrfToken: csrfToken || "itsafake",
      email,
      isadmin
    }));

export const apiInfo = () =>
  get("/")
    .then(parseResponse)
    .then(({ csrfToken, response: { version, route } }) => ({
      csrfToken: csrfToken || "itsafake",
      version,
      route
    }));

export const policy = () =>
  get("/v1/policy")
    .then(parseResponse)
    .then(({ response }) => response);

export const newUser = (csrf, email, password) =>
  post("/user/new", csrf, { email, password })
    .then(parseResponse)
    .then(({ response }) => response || {});

export const verifyNewUser = searchQuery => {
  window.location = apiBase + "/user/verify" + searchQuery;
};

export const login = (csrf, email, password) =>
  post("/login", csrf, { email, password })
    .then(parseResponse)
    .then(({ response }) => response);

export const changePassword = (csrf, currentpassword, newpassword) =>
  post("/user/password/change", csrf, { currentpassword, newpassword })
    .then(parseResponse)
    .then(({ response }) => response || {});

export const forgottenPasswordRequest = (csrf, email) =>
  post("/user/password/reset", csrf, { email })
    .then(parseResponse)
    .then(({ response }) => response);

export const passwordResetRequest = (
  csrf,
  email,
  verificationtoken,
  newpassword
) =>
  post("/user/password/reset", csrf, { email, verificationtoken, newpassword })
    .then(parseResponse)
    .then(({ response }) => response);

export const secret = csrf =>
  post("/secret", csrf, {})
    .then(parseResponse)
    .then(({ response }) => response);

export const vetted = () =>
  get("/v1/proposals/vetted")
    .then(parseResponse)
    .then(({ response }) => response);

export const unvetted = () =>
  get("/v1/proposals/unvetted")
    .then(parseResponse)
    .then(({ response }) => response);

export const proposal = token =>
  get(`/v1/proposals/${token}`)
    .then(parseResponse)
    .then(({ response }) => response);

export const proposalComments = token =>
  get(`/v1/proposals/${token}/comments`)
    .then(parseResponse)
    .then(({ response }) => response);

export const proposalSetStatus = (csrf, token, status) =>
  post(`/proposals/${token}/status`, csrf, { proposalstatus: status, token })
    .then(parseResponse)
    .then(({ response }) => response);

export const logout = csrf => post("/logout", csrf, {}).then(() => ({}));

export const assets = () =>
  get("/assets")
    .then(parseResponse)
    .then(({ response }) => response);

export const newProposal = (csrf, name, description, files) => {
  if(files) {
    files.forEach(file => {
      file.digest = CryptoJS.SHA256(arrayBufferToWordArray(base64ToArrayBuffer(file.payload))).toString(CryptoJS.enc.Hex);
    });
  }

  return post("/proposals/new", csrf, {
    name,
    files: [
      {
        name: "index.md",
        mime: "text/plain; charset=utf-8",
        digest: CryptoJS.SHA256(description).toString(CryptoJS.enc.Hex),
        payload: btoa(description)
      },
      ...(files || []).map(({ name, mime, digest, payload }) => ({
        name, mime, digest, payload
      }))
    ]
  })
    .then(parseResponse)
    .then(
      ({ response: { censorshiprecord: { token, merkle, signature } } }) => ({
        token,
        merkle,
        signature
      })
    );
};

export const newComment = (csrf, token, comment, parentid=0) =>
  post("/comments/new", csrf, { token, parentid: parentid || 0, comment })
    .then(parseResponse)
    .then(({ response }) => response);
