import "isomorphic-fetch";
import CryptoJS from "crypto-js";
import * as pki from "./pki";
import get from "lodash/fp/get";
import MerkleTree from "mtree";
import qs from "query-string";
import { PROPOSAL_STATUS_UNREVIEWED } from "../constants";
import { getHumanReadableError, base64ToArrayBuffer, arrayBufferToWordArray, utoa } from "../helpers";

export const TOP_LEVEL_COMMENT_PARENTID = "0";

const STATUS_ERR = {
  400: "Bad response from server",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not found"
};

const apiBase = "/api";
const getUrl = (path, version = "v1") => `${apiBase}/${version}${path}`;
const getResponse = get("response");

const digestPayload = payload => CryptoJS
  .SHA256(arrayBufferToWordArray(base64ToArrayBuffer(payload)))
  .toString(CryptoJS.enc.Hex);

export const convertMarkdownToFile = markdown => ({
  name: "index.md",
  mime: "text/plain; charset=utf-8",
  payload: utoa(markdown)
});

export const makeProposal = (name, markdown, attachments=[]) => ({
  files: [ convertMarkdownToFile(name + "\n" + markdown), ...(attachments || []) ]
    .map(({ name, mime, payload}) => ({ name, mime, payload, digest: digestPayload(payload) }))
});

export const makeComment = (token, comment, parentid) => ({
  token, parentid: parentid || TOP_LEVEL_COMMENT_PARENTID, comment
});

export const signProposal = (email, proposal) => pki.myPubKeyHex(email).then(publickey => {
  const tree = new MerkleTree(proposal.files.map(x => Buffer(get("digest", x), "hex")).sort());
  const root = tree.root().toString("hex");
  console.log("merkle root", root);
  return pki.signStringHex(email, root).then(signature => ({ ...proposal, publickey, signature }));
});

export const signComment = (email, comment) => pki.myPubKeyHex(email).then(publickey =>
  pki.signStringHex(email, [comment.token, comment.parentid, comment.comment].join(""))
    .then(signature => ({ ...comment, publickey, signature })));

const parseResponseBody = response => {
  const contentType = response.headers.get("content-type");
  if(contentType && contentType.includes("application/json")) return response.json();
  throw new Error(STATUS_ERR[response.status] || "Internal server error");
};

const parseResponse = response => parseResponseBody(response).then(json => {
  if (json.errorcode) throw new Error(getHumanReadableError(json.errorcode, json.errorcontext));
  return { response: json, csrfToken: response.headers.get("X-Csrf-Token") };
});

const GET = path => fetch(apiBase + path, { credentials: "same-origin" }).then(parseResponse);
const POST = (path, csrf, json, method = "POST") => fetch(getUrl(path), {
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Csrf-Token": csrf
  },
  credentials: "include", // Include cookies
  method,
  body: JSON.stringify(json)
}).then(parseResponse);

export const me = () => GET("/v1/user/me").then(({ csrfToken, response:
  { email, isadmin, haspaid, paywalladdress, paywallamount, userid } }) => ({
  csrfToken: csrfToken || "itsafake", email, isadmin, haspaid, paywalladdress, paywallamount, userid
}));

export const apiInfo = () => GET("/").then(({ csrfToken, response: { version, route, pubkey } }) => ({
  csrfToken: csrfToken || "itsafake", version, route, pubkey
}));

export const newUser = (csrf, email, password) => pki.myPubKeyHex(email).then(publickey =>
  POST("/user/new", csrf, { email, password, publickey }).then(getResponse));

export const verifyNewUser = searchQuery => {
  const { email, verificationtoken } = qs.parse(searchQuery);
  return pki.signStringHex(email, verificationtoken)
    .then(signature => GET("/v1/user/verify?" + qs.stringify({ email, verificationtoken, signature })))
    .then(getResponse);
};

export const userProposals = userid =>
  GET(`/v1/user/proposals?${qs.stringify({userid})}`).then(getResponse);

export const login = (csrf, email, password) =>
  POST("/login", csrf, { email, password }).then(getResponse);

export const changePassword = (csrf, currentpassword, newpassword) =>
  POST("/user/password/change", csrf, { currentpassword, newpassword }).then(getResponse);

export const forgottenPasswordRequest = (csrf, email) =>
  POST("/user/password/reset", csrf, { email }).then(getResponse);

export const passwordResetRequest = ( csrf, email, verificationtoken, newpassword ) =>
  POST("/user/password/reset", csrf, { email, verificationtoken, newpassword }).then(getResponse);

export const updateKeyRequest = (csrf, email) => pki.generateKeys(email).then(
  () => pki.myPubKeyHex(email).then(
    publickey => POST("/user/key", csrf, { publickey }).then(getResponse)
  )
);

export const verifyKeyRequest = (csrf, email, verificationtoken) =>
  pki.signStringHex(email, verificationtoken).then(
    signature => POST("/user/key/verify", csrf, { signature, verificationtoken }).then(getResponse)
  );

export const policy = () => GET("/v1/policy").then(getResponse);
export const vetted = () => GET("/v1/proposals/vetted").then(getResponse);
export const unvetted = () => GET("/v1/proposals/unvetted").then(getResponse);
export const proposal = token => GET(`/v1/proposals/${token}`).then(getResponse);
export const proposalComments = token => GET(`/v1/proposals/${token}/comments`).then(getResponse);
export const logout = csrf => POST("/logout", csrf, {}).then(() => ({}));

export const proposalSetStatus = (email, csrf, token, status) =>
  pki.myPubKeyHex(email).then(publickey =>
  pki.signStringHex(email, token + status).then(signature => POST(
    `/proposals/${token}/status`, csrf,
    { proposalstatus: status, token, signature, publickey }
  ))).then(getResponse);

export const newProposal = (csrf, proposal) =>
  POST("/proposals/new", csrf, proposal).then(({ response: { censorshiprecord }}) => ({
    ...proposal, censorshiprecord, timestamp: Date.now() / 1000, status: PROPOSAL_STATUS_UNREVIEWED
  }));

export const newComment = (csrf, comment) => POST("/comments/new", csrf, comment).then(getResponse);
