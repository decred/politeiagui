import "isomorphic-fetch";

const apiBase = "/api";
const getUrl = (path, version="v1") => `${apiBase}/${version}${path}`;

const parseResponseBody = response => {
  if (response.status >= 400) {
    throw new Error("Bad response from server");
  }
  return response.json();
};

const parseResponse = response => parseResponseBody(response)
  .then(json => ({
    response: json,
    csrfToken: response.headers.get("X-Csrf-Token")
  }));

const get = (path) =>
  fetch(apiBase + path, {
    credentials: "same-origin"
  });

const post = (path, csrf, json, method="POST") =>
  fetch(getUrl(path), {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Csrf-Token": csrf
    },
    credentials: "include", // Include cookies
    method,
    body: JSON.stringify(json)
  });

export const apiInfo = () =>
  get("/")
    .then(parseResponse)
    .then(response => {
      console.log("response:", response);
      return response;
    })
    .then(({ csrfToken, response: { version, route }}) => ({
      csrfToken, version, route
    }));

export const newUser = (csrf, email, password) =>
  post("/user/new/", csrf, { email, password })
    .then(parseResponse)
    .then(({ verificationtoken }) => ({ verificationtoken }));

export const verifyNewUser = (csrf, email, verificationtoken) =>
  post("/user/verify/", csrf, { email, verificationtoken })
    .then(parseResponse);

export const login = (csrf, email, password) =>
  post("/login/", csrf, { email, password })
    .then(parseResponse);

export const secret = (csrf) =>
  post("/secret/", csrf, {})
    .then(parseResponse);

export const logout = (csrf) =>
  post("/logout/", csrf, {})
    .then(parseResponse);

export const assets = () =>
  get("/assets/")
    .then(parseResponse);
