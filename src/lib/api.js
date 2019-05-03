import "isomorphic-fetch";
import CryptoJS from "crypto-js";
import * as pki from "./pki";
import qs from "query-string";
import { sha3_256 } from "js-sha3";
import get from "lodash/fp/get";
import MerkleTree from "./merkle";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  INVOICE_STATUS_UNREVIEWED
} from "../constants";
import {
  getHumanReadableError,
  base64ToArrayBuffer,
  arrayBufferToWordArray,
  utoa
} from "../helpers";

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

export const digestPayload = payload =>
  CryptoJS.SHA256(
    arrayBufferToWordArray(base64ToArrayBuffer(payload))
  ).toString(CryptoJS.enc.Hex);

export const digest = payload => sha3_256(payload);

export const convertMarkdownToFile = markdown => ({
  name: "index.md",
  mime: "text/plain; charset=utf-8",
  payload: utoa(markdown)
});
export const convertJsonToFile = json => ({
  name: "invoice.json",
  mime: "text/plain; charset=utf-8",
  payload: utoa(JSON.stringify(json))
});

export const makeProposal = (name, markdown, attachments = []) => ({
  files: [
    convertMarkdownToFile(name + "\n\n" + markdown),
    ...(attachments || [])
  ].map(({ name, mime, payload }) => ({
    name,
    mime,
    payload,
    digest: digestPayload(payload)
  }))
});

export const makeInvoice = (
  month,
  year,
  exchangerate,
  contractorname,
  contractorlocation,
  contractorcontact,
  contractorrate,
  paymentaddress,
  lineItems,
  files = []
) => {
  const { name, mime, payload } = convertJsonToFile({
    version: 1,
    month,
    year,
    exchangerate,
    contractorname,
    contractorlocation,
    contractorcontact,
    contractorrate,
    paymentaddress,
    lineItems
  });
  return {
    id: "",
    month,
    year,
    exchangerate,
    contractorname,
    contractorlocation,
    contractorcontact,
    contractorrate,
    paymentaddress,
    files: [
      {
        name,
        mime,
        payload,
        digest: digestPayload(payload)
      },
      ...files
    ].map(({ name, mime, payload }) => ({
      name,
      mime,
      payload,
      digest: digestPayload(payload)
    }))
  };
};

export const makeComment = (token, comment, parentid) => ({
  token,
  parentid: parentid || TOP_LEVEL_COMMENT_PARENTID,
  comment
});

export const makeLikeComment = (token, action, commentid) => ({
  token,
  commentid,
  action
});

export const makeCensoredComment = (token, reason, commentid) => ({
  token,
  commentid,
  reason
});

export const signRegister = (email, proposal) => {
  return pki.myPubKeyHex(email).then(publickey => {
    const digests = proposal.files
      .map(x => Buffer.from(get("digest", x), "hex"))
      .sort(Buffer.compare);
    const tree = new MerkleTree(digests);
    const root = tree.getRoot().toString("hex");
    return pki
      .signStringHex(email, root)
      .then(signature => ({ ...proposal, publickey, signature }));
  });
};

export const signComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.parentid, comment.comment].join("")
        )
        .then(signature => ({ ...comment, publickey, signature }))
    );

export const signLikeComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.commentid, comment.action].join("")
        )
        .then(signature => ({ ...comment, publickey, signature }))
    );

export const signCensorComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.commentid, comment.reason].join("")
        )
        .then(signature => ({ ...comment, publickey, signature }))
    );

const parseResponseBody = response => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json"))
    return response.json();
  const err = new Error(STATUS_ERR[response.status] || "Internal server error");
  err.internalError = true;
  err.statusCode = response.status;
  throw err;
};

export const parseResponse = response =>
  parseResponseBody(response).then(json => {
    if (json.errorcode) {
      const err = new Error(
        getHumanReadableError(json.errorcode, json.errorcontext)
      );
      err.internalError = false;
      err.errorCode = json.errorcode;
      err.errorContext = json.errorcontext;
      throw err;
    }
    return { response: json, csrfToken: response.headers.get("X-Csrf-Token") };
  });

const GET = path =>
  fetch(apiBase + path, { credentials: "include" }).then(parseResponse);

const getOptions = (csrf, json, method) => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Csrf-Token": csrf
  },
  credentials: "include", // Include cookies
  method,
  body: JSON.stringify(json)
});

const POST = (path, csrf, json) =>
  fetch(getUrl(path), getOptions(csrf, json, "POST")).then(parseResponse);

const PUT = (path, csrf, json) =>
  fetch(getUrl(path), getOptions(csrf, json, "PUT")).then(parseResponse);

export const me = () => GET("/v1/user/me").then(getResponse);

export const apiInfo = () =>
  GET("/").then(
    ({
      csrfToken,
      response: { version, route, pubkey, testnet, mode, activeusersession }
    }) => ({
      csrfToken: csrfToken,
      version,
      route,
      pubkey,
      testnet,
      mode,
      activeusersession
    })
  );

export const newUser = (csrf, email, username, password) =>
  pki.generateKeys().then(keys =>
    pki.loadKeys(email, keys).then(() =>
      pki.myPubKeyHex(email).then(publickey =>
        POST("/user/new", csrf, {
          email,
          username,
          password: digest(password),
          publickey
        }).then(getResponse)
      )
    )
  );

export const register = (csrf, email, username, password, verificationtoken) =>
  pki.generateKeys().then(keys =>
    pki.loadKeys(email, keys).then(() =>
      pki.myPubKeyHex(email).then(publickey =>
        POST("/register", csrf, {
          email,
          username,
          password: digest(password),
          publickey,
          verificationtoken
        }).then(getResponse)
      )
    )
  );

export const verifyNewUser = (email, verificationToken) => {
  return pki
    .signStringHex(email, verificationToken)
    .then(signature =>
      GET(
        "/v1/user/verify?" +
          qs.stringify({ email, verificationToken, signature })
      )
    )
    .then(getResponse);
};

export const likedComments = token =>
  GET(`/v1/user/proposals/${token}/commentslikes`).then(getResponse);

export const proposalPaywallDetails = () =>
  GET("/v1/proposals/paywall").then(getResponse);

export const userProposalCredits = () =>
  GET("/v1/user/proposals/credits").then(getResponse);

export const editUser = (csrf, { emailnotifications }) =>
  POST("/user/edit", csrf, {
    emailnotifications
  }).then(getResponse);

export const manageUser = (csrf, userid, action, reason) =>
  POST("/user/manage", csrf, { userid, action, reason }).then(getResponse);

export const verifyUserPayment = () =>
  GET("/v1/user/verifypayment").then(getResponse);

export const login = (csrf, email, password) =>
  POST("/login", csrf, { email, password: digest(password) }).then(getResponse);

export const likeComment = (csrf, comment) =>
  POST("/comments/like", csrf, comment).then(getResponse);

export const censorComment = (csrf, comment) =>
  POST("/comments/censor", csrf, comment).then(getResponse);

export const changeUsername = (csrf, password, newusername) =>
  POST("/user/username/change", csrf, {
    password: digest(password),
    newusername
  }).then(getResponse);

export const changePassword = (csrf, currentpassword, newpassword) =>
  POST("/user/password/change", csrf, {
    currentpassword: digest(currentpassword),
    newpassword: digest(newpassword)
  }).then(getResponse);

export const forgottenPasswordRequest = (csrf, email) =>
  POST("/user/password/reset", csrf, { email }).then(getResponse);

export const resendVerificationEmailRequest = (csrf, email) =>
  pki
    .generateKeys()
    .then(keys => pki.loadKeys(email, keys))
    .then(() => pki.myPubKeyHex(email))
    .then(publickey =>
      POST("/user/new/resend", csrf, { email, publickey }).then(getResponse)
    );

export const passwordResetRequest = (
  csrf,
  email,
  verificationtoken,
  newpassword
) =>
  POST("/user/password/reset", csrf, {
    email,
    verificationtoken,
    newpassword: digest(newpassword)
  }).then(getResponse);

export const updateKeyRequest = (csrf, publickey) =>
  POST("/user/key", csrf, { publickey }).then(getResponse);

export const verifyKeyRequest = (csrf, email, verificationtoken) =>
  pki
    .signStringHex(email, verificationtoken)
    .then(signature =>
      POST("/user/key/verify", csrf, { signature, verificationtoken }).then(
        getResponse
      )
    );

export const policy = () => GET("/v1/policy").then(getResponse);
export const vetted = after => {
  return !after
    ? GET("/v1/proposals/vetted").then(getResponse)
    : GET(`/v1/proposals/vetted?${qs.stringify({ after })}`).then(getResponse);
};

export const unvetted = after => {
  return !after
    ? GET("/v1/proposals/unvetted").then(getResponse)
    : GET(`/v1/proposals/unvetted?${qs.stringify({ after })}`).then(
        getResponse
      );
};

export const userProposals = (userid, after) => {
  return !after
    ? GET(`/v1/user/proposals?${qs.stringify({ userid })}`).then(getResponse)
    : GET(`/v1/user/proposals?${qs.stringify({ userid, after })}`).then(
        getResponse
      );
};

export const searchUser = obj =>
  GET(`/v1/users?${qs.stringify(obj)}`).then(getResponse);

export const status = () => GET("/v1/proposals/stats").then(getResponse);
export const proposal = (token, version = null) =>
  GET(`/v1/proposals/${token}` + (version ? `?version=${version}` : "")).then(
    getResponse
  );

export const user = userId => GET(`/v1/user/${userId}`).then(getResponse);
export const proposalComments = token =>
  GET(`/v1/proposals/${token}/comments`).then(getResponse);
export const invoiceComments = token =>
  GET(`/v1/invoices/${token}/comments`).then(getResponse);
export const logout = csrf =>
  POST("/logout", csrf, {}).then(() => {
    localStorage.removeItem("state");
    return {};
  });

export const proposalSetStatus = (email, csrf, token, status, censorMsg) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki.signStringHex(email, token + status + censorMsg).then(signature => {
        return POST(`/proposals/${token}/status`, csrf, {
          proposalstatus: status,
          token,
          signature,
          publickey,
          statuschangemessage: censorMsg
        });
      })
    )
    .then(getResponse);

export const invoiceSetStatus = (email, csrf, token, version, status, reason) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki
        .signStringHex(email, token + version + status + reason)
        .then(signature => {
          return POST(`/invoices/${token}/status`, csrf, {
            status,
            token,
            signature,
            publickey,
            reason
          });
        })
    )
    .then(getResponse);

export const newProposal = (csrf, proposal) =>
  POST("/proposals/new", csrf, proposal).then(
    ({ response: { censorshiprecord } }) => ({
      ...proposal,
      censorshiprecord,
      timestamp: Date.now() / 1000,
      status: PROPOSAL_STATUS_UNREVIEWED
    })
  );

export const editProposal = (csrf, proposal) =>
  POST("/proposals/edit", csrf, proposal).then(getResponse);

export const newComment = (csrf, comment) =>
  POST("/comments/new", csrf, comment).then(getResponse);

export const startVote = (
  email,
  csrf,
  token,
  duration,
  quorumpercentage,
  passpercentage
) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki.signStringHex(email, token).then(signature =>
        POST("/proposals/startvote", csrf, {
          vote: {
            token,
            mask: 3,
            duration,
            quorumpercentage,
            passpercentage,
            options: [
              {
                id: "no",
                description: "Don't approve proposal",
                bits: 1
              },
              {
                id: "yes",
                description: "Approve proposal",
                bits: 2
              }
            ]
          },
          signature,
          publickey
        })
      )
    )
    .then(getResponse);

export const proposalsVoteStatus = () =>
  GET("/v1/proposals/votestatus").then(getResponse);
export const proposalVoteStatus = token =>
  GET(`/v1/proposals/${token}/votestatus`).then(getResponse);
export const proposalVoteResults = token =>
  GET(`/v1/proposals/${token}/votes`).then(getResponse);

export const proposalAuthorizeOrRevokeVote = (
  csrf,
  action,
  token,
  email,
  version
) =>
  pki
    .myPubKeyHex(email)
    .then(publickey =>
      pki.signStringHex(email, token + version + action).then(signature =>
        POST("/proposals/authorizevote", csrf, {
          action,
          token,
          signature,
          publickey
        })
      )
    )
    .then(getResponse);

export const proposalPaywallPayment = () =>
  GET("/v1/proposals/paywallpayment").then(getResponse);

export const rescanUserPayments = (csrf, userid) =>
  PUT("/user/payments/rescan", csrf, { userid }).then(getResponse);

// CMS
export const inviteNewUser = (csrf, email) =>
  POST("/invite", csrf, {
    email
  }).then(getResponse);

export const newInvoice = (csrf, invoice) =>
  POST("/invoices/new", csrf, invoice).then(
    ({ response: { censorshiprecord } }) => ({
      ...invoice,
      censorshiprecord,
      timestamp: Date.now() / 1000,
      status: INVOICE_STATUS_UNREVIEWED
    })
  );

export const editInvoice = (csrf, invoice) =>
  POST("/invoices/edit", csrf, invoice).then(getResponse);

export const invoice = (token, version = null) =>
  GET(`/v1/invoices/${token}` + (version ? `?version=${version}` : "")).then(
    getResponse
  );

export const userInvoices = () => GET("/v1/user/invoices").then(getResponse);

export const adminInvoices = csrf =>
  POST("/admin/invoices", csrf, {}).then(getResponse);

export const generatePayouts = csrf =>
  POST("/admin/generatepayouts", csrf, {}).then(getResponse);

export const tokenInventory = () =>
  GET("/v1/proposals/tokeninventory").then(getResponse);

export const exchangeRate = (csrf, month, year) =>
  POST("/invoices/exchangerate", csrf, { month, year }).then(getResponse);
