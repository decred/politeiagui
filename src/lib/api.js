import Promise from "promise";
import "isomorphic-fetch";
import * as pki from "./pki";
import qs from "query-string";
import get from "lodash/fp/get";
import MerkleTree from "./merkle";
import {
  INVOICE_STATUS_UNREVIEWED,
  DCC_STATUS_ACTIVE,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION
} from "../constants";
import {
  getHumanReadableError,
  digestPayload,
  digest,
  objectToSHA256,
  utoa,
  objectToBuffer,
  bufferToBase64String
} from "../helpers";
import { convertObjectToUnixTimestamp } from "src/utils";

const STATUS_ERR = {
  400: "Bad response from server",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not found"
};

export const TOP_LEVEL_COMMENT_PARENTID = 0;

const apiBase = "/api/";
const getUrl = (path, version) => {
  if (!path && !version) return apiBase;
  return `${apiBase}${version}${path}`;
};

const getResponse = get("response");

export const convertMarkdownToFile = (markdown) => ({
  name: "index.md",
  mime: "text/plain; charset=utf-8",
  payload: utoa(markdown)
});
export const convertJsonToFile = (json, name) => ({
  name,
  mime: "text/plain; charset=utf-8",
  payload: utoa(JSON.stringify(json))
});

export const makeProposal = (
  name,
  markdown,
  rfpDeadline,
  type,
  rfpLink,
  attachments = []
) => ({
  files: [
    convertMarkdownToFile(name + "\n\n" + markdown),
    ...(attachments || [])
  ].map(({ name, mime, payload }) => ({
    name,
    mime,
    payload,
    digest: digestPayload(payload)
  })),
  metadata: [
    {
      hint: "proposalmetadata",
      payload: bufferToBase64String(
        objectToBuffer({
          name,
          linkby:
            type === PROPOSAL_TYPE_RFP
              ? convertObjectToUnixTimestamp(rfpDeadline)
              : undefined,
          linkto: type === PROPOSAL_TYPE_RFP_SUBMISSION ? rfpLink : undefined
        })
      ),
      digest: objectToSHA256({
        name,
        linkby:
          type === PROPOSAL_TYPE_RFP
            ? convertObjectToUnixTimestamp(rfpDeadline)
            : undefined,
        linkto: type === PROPOSAL_TYPE_RFP_SUBMISSION ? rfpLink : undefined
      })
    }
  ]
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
  const { name, mime, payload } = convertJsonToFile(
    {
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
    },
    "invoice.json"
  );

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

export const makeComment = (token, comment, parentid, state) => ({
  token,
  parentid: parentid || TOP_LEVEL_COMMENT_PARENTID,
  comment,
  state
});

export const makeDccComment = (token, comment, parentid) => ({
  token,
  comment,
  parentid
});

export const makeCommentVote = (token, vote, commentid, state) => ({
  state,
  token,
  commentid,
  vote
});

export const makeCensoredComment = (state, token, reason, commentid) => ({
  state,
  token,
  commentid,
  reason
});

export const makeDCC = (
  type,
  nomineeuserid,
  statement,
  domain,
  contractortype
) => {
  const { name, mime, payload } = convertJsonToFile(
    {
      type,
      nomineeuserid,
      statement,
      domain,
      contractortype
    },
    "dcc.json"
  );
  return {
    name,
    mime,
    payload,
    digest: digestPayload(payload)
  };
};

export const makeDCCVote = (token, vote) => ({ token, vote });

export const signRegister = (userid, record) => {
  if (typeof userid !== "string" || typeof record !== "object") {
    throw Error("signRegister: Invalid params");
  }
  return pki.myPubKeyHex(userid).then((publickey) => {
    const digests = [...record.files, ...(record.metadata || [])]
      .map((x) => Buffer.from(get("digest", x), "hex"))
      .sort(Buffer.compare);
    const tree = new MerkleTree(digests);
    const root = tree.getRoot().toString("hex");
    return pki
      .signStringHex(userid, root)
      .then((signature) => ({ ...record, publickey, signature }));
  });
};

export const signDccComment = (userid, comment) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(
          userid,
          [comment.token, comment.parentid, comment.comment].join("")
        )
        .then((signature) => ({ ...comment, publickey, signature }))
    );

export const signComment = (userid, comment) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(
          userid,
          [
            comment.state,
            comment.token,
            comment.parentid,
            comment.comment
          ].join("")
        )
        .then((signature) => ({ ...comment, publickey, signature }))
    );

export const signDcc = (userid, dcc) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(userid, dcc.digest)
        .then((signature) => ({ file: dcc, publickey, signature }))
    );

export const signDccVote = (userid, dccvote) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(userid, [dccvote.token, dccvote.vote].join(""))
        .then((signature) => ({ ...dccvote, publickey, signature }))
    );

export const signCommentVote = (userid, comment) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(
          userid,
          [comment.state, comment.token, comment.commentid, comment.vote].join(
            ""
          )
        )
        .then((signature) => ({ ...comment, publickey, signature }))
    );

export const signCensorComment = (userid, comment) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(
          userid,
          [
            comment.state,
            comment.token,
            comment.commentid,
            comment.reason
          ].join("")
        )
        .then((signature) => ({ ...comment, publickey, signature }))
    );

const parseResponseBody = (response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json"))
    return response.json();
  const err = new Error(STATUS_ERR[response.status] || "Internal server error");
  err.internalError = true;
  err.statusCode = response.status;
  throw err;
};

export const parseResponse = (response) =>
  parseResponseBody(response).then((json) => {
    if (json.errorcode) {
      if (json.errorcontext === null) json.errorcontext = [];
      const err = new Error(
        getHumanReadableError(json.errorcode, json.errorcontext)
      );
      err.internalError = false;
      err.errorCode = json.errorcode;
      err.errorContext = json.errorcontext;
      throw err;
    }
    if (STATUS_ERR[response.status]) {
      throw new Error(STATUS_ERR[response.status]);
    }
    return {
      response: json,
      csrfToken: response.headers.get("X-Csrf-Token")
    };
  });

const GET = (path, version = "v1", withoutVersion) =>
  fetch(getUrl(path, !withoutVersion ? version : undefined), {
    credentials: "include"
  }).then(parseResponse);

const getOptions = (csrf, json, method) => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "X-Csrf-Token": csrf
  },
  credentials: "include", // Include cookies
  method,
  body: JSON.stringify(json)
});

const POST = (path, csrf, json, version = "v1") =>
  fetch(getUrl(path, version), getOptions(csrf, json, "POST")).then(
    parseResponse
  );

const PUT = (path, csrf, json, version = "v1") =>
  fetch(getUrl(path, version), getOptions(csrf, json, "PUT")).then(
    parseResponse
  );

export const me = () => GET("/user/me").then(getResponse);

export const apiInfo = () =>
  GET("", "", true).then(
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
  pki.generateKeys().then((keys) =>
    pki.loadKeys(username, keys).then(() =>
      pki.myPubKeyHex(username).then((publickey) =>
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
  pki.generateKeys().then((keys) =>
    pki.loadKeys(username, keys).then(() =>
      pki.myPubKeyHex(username).then((publickey) =>
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

export const verifyNewUser = (email, verificationToken, username) => {
  return pki
    .signStringHex(username, verificationToken)
    .then((signature) =>
      GET(
        `/user/verify?${qs.stringify({
          email,
          verificationToken,
          signature
        })}`
      )
    )
    .then(getResponse);
};

export const likedComments = (csrf, token, userid, state) =>
  POST("/comments/votes", csrf, { token, userid, state }).then(getResponse);

export const editUser = (csrf, params) =>
  POST("/user/edit", csrf, params).then(getResponse);

export const manageUser = (csrf, userid, action, reason) =>
  POST("/user/manage", csrf, { userid, action, reason }).then(getResponse);

export const manageCmsUser = (
  csrf,
  userid,
  domain,
  contractortype,
  supervisoruserids,
  proposalsowned
) =>
  POST("/admin/managecms", csrf, {
    userid,
    domain,
    contractortype,
    supervisoruserids,
    proposalsowned
  });

export const proposalBilling = (csrf, token) =>
  POST("/proposals/billing", csrf, {
    token
  }).then(getResponse);

export const login = (csrf, email, password) =>
  POST("/login", csrf, { email, password: digest(password) }).then(getResponse);

// XXX this route hasn't been merged into the master of the backend.
// Pull request: https://github.com/decred/politeia/pull/940 ???
export const loginWithUsername = (csrf, username, password) =>
  POST("/login", csrf, { username, password: digest(password) }).then(
    getResponse
  );

export const commentVote = (csrf, comment) =>
  POST("/comment/vote", csrf, comment).then(getResponse);

export const censorComment = (csrf, comment) =>
  POST("/comment/censor", csrf, comment).then(getResponse);

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

export const resetPassword = (csrf, username, email) =>
  POST("/user/password/reset", csrf, { username, email }).then(getResponse);

export const verifyResetPassword = (
  csrf,
  username,
  verificationtoken,
  newpassword
) =>
  POST("/user/password/reset/verify", csrf, {
    username,
    verificationtoken,
    newpassword: digest(newpassword)
  }).then(getResponse);

export const resendVerificationEmailRequest = (csrf, email, username) =>
  pki
    .generateKeys()
    .then((keys) => pki.loadKeys(username, keys))
    .then(() => pki.myPubKeyHex(username))
    .then((publickey) =>
      POST("/user/new/resend", csrf, { email, publickey }).then(getResponse)
    );

export const updateKeyRequest = (csrf, publickey) =>
  POST("/user/key", csrf, { publickey }).then(getResponse);

export const verifyKeyRequest = (csrf, userid, verificationtoken) =>
  pki
    .signStringHex(userid, verificationtoken)
    .then((signature) =>
      POST("/user/key/verify", csrf, { signature, verificationtoken }).then(
        getResponse
      )
    );

export const policy = () => GET("/policy").then(getResponse);

// This route wasn't implemented yet with tlog and will be added in later
// stage.
export const userProposals = (userid, after) => {
  return !after
    ? GET(`/user/proposals?${qs.stringify({ userid })}`).then(getResponse)
    : GET(`/user/proposals?${qs.stringify({ userid, after })}`).then(
        getResponse
      );
};

export const searchUser = (obj) =>
  GET(`/users?${qs.stringify(obj)}`).then(getResponse);

export const searchCmsUsers = (obj) =>
  GET(`/cmsusers?${qs.stringify(obj)}`).then(getResponse);

export const proposalsBatch = (csrf, payload) =>
  POST("/proposals", csrf, payload).then(getResponse);

export const user = (userId) => GET(`/user/${userId}`).then(getResponse);

export const proposalComments = (csrf, token, state) =>
  POST("/comments", csrf, { token, state }).then(getResponse);

export const invoiceComments = (token) =>
  GET(`/invoices/${token}/comments`).then(getResponse);

export const logout = (csrf) =>
  POST("/logout", csrf, {}).then(() => {
    localStorage.removeItem("state");
    return {};
  });

export const proposalSetStatus = (
  userid,
  csrf,
  token,
  status,
  version,
  state,
  reason
) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(userid, token + version + status + reason)
        .then((signature) =>
          POST("/proposal/setstatus", csrf, {
            status,
            version,
            state,
            token,
            signature,
            publickey,
            reason
          })
        )
    )
    .then(getResponse);

export const invoiceSetStatus = (
  userid,
  csrf,
  token,
  version,
  status,
  reason
) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(userid, token + version + status + reason)
        .then((signature) => {
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
  POST("/proposal/new", csrf, proposal).then(getResponse);

export const editProposal = (csrf, proposal) =>
  POST("/proposal/edit", csrf, proposal).then(getResponse);

export const newComment = (csrf, comment) =>
  POST("/comment/new", csrf, comment).then(getResponse);

export const startVote = (csrf, userid, voteParams) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      Promise.all(
        voteParams.map((params) =>
          pki.signStringHex(userid, objectToSHA256(params))
        )
      ).then((signatures) =>
        POST("/vote/start", csrf, {
          starts: signatures.map((signature, i) => ({
            params: voteParams[i],
            publickey,
            signature
          }))
        })
      )
    )
    .then(getResponse);

export const proposalsBatchVoteSummary = (csrf, tokens) =>
  POST("/votes/summaries", csrf, {
    tokens
  }).then(getResponse);

export const proposalVoteResults = (token) =>
  POST("/votes/results", { token }).then(getResponse);

export const proposalAuthorizeOrRevokeVote = (
  csrf,
  action,
  token,
  userid,
  version
) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(userid, `${token}${version}${action}`)
        .then((signature) =>
          POST("/vote/authorize", csrf, {
            action,
            token,
            version: +version,
            signature,
            publickey
          })
        )
    )
    .then(getResponse);

export const verifyUserPayment = () =>
  GET("/user/payments/registration").then(getResponse);

export const proposalPaywallDetails = () =>
  GET("/user/payments/paywall").then(getResponse);

export const proposalPaywallPayment = () =>
  GET("/user/payments/paywalltx").then(getResponse);

export const userProposalCredits = () =>
  GET("/user/payments/credits").then(getResponse);

export const rescanUserPayments = (csrf, userid) =>
  PUT("/user/payments/rescan", csrf, { userid }).then(getResponse);

export const proposalsInventory = (csrf) =>
  POST("/proposals/inventory", csrf, {}).then(getResponse);

// XXX change function name to votesInventory
export const tokenInventory = (csrf) =>
  POST("/votes/inventory", csrf, {}).then(getResponse);

// CMS
export const inviteNewUser = (csrf, payload) =>
  POST("/invite", csrf, payload).then(getResponse);

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
  GET(`/invoices/${token}` + (version ? `?version=${version}` : "")).then(
    getResponse
  );

export const userInvoices = () => GET("/user/invoices").then(getResponse);

export const adminInvoices = (csrf) =>
  POST("/invoices", csrf, {}).then(getResponse);

export const generatePayouts = (csrf) =>
  POST("/admin/generatepayouts", csrf, {}).then(getResponse);

export const invoicePayouts = (csrf, starttime, endtime) =>
  POST("/admin/invoicepayouts", csrf, { starttime, endtime }).then(getResponse);

export const payApprovedInvoices = () =>
  GET("/admin/payinvoices").then(getResponse);

export const getSpendingSummary = () =>
  GET("/proposals/spendingsummary").then(getResponse);

export const getSpendingDetails = (csrf, token) =>
  POST("/proposals/spendingdetails", csrf, { token }).then(getResponse);

export const exchangeRate = (csrf, month, year) =>
  POST("/invoices/exchangerate", csrf, { month, year }).then(getResponse);

export const userSubcontractors = (csrf) =>
  GET("/user/subcontractors", csrf).then(getResponse);

export const newDcc = (csrf, dcc) =>
  POST("/dcc/new", csrf, dcc).then(({ response: { censorshiprecord } }) => ({
    ...dcc,
    censorshiprecord,
    timestamp: Date.now() / 1000,
    status: DCC_STATUS_ACTIVE
  }));

export const dccsByStatus = (csrf, status) =>
  POST("/dcc", csrf, status).then(getResponse);

export const dccDetails = (csrf, token) =>
  GET(`/dcc/${token}`, csrf).then(getResponse);

export const supportOpposeDCC = (csrf, vote) =>
  POST("/dcc/supportoppose", csrf, vote).then(getResponse);

export const setDCCStatus = (csrf, userid, token, status, reason) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki.signStringHex(userid, token + status + reason).then((signature) => {
        return POST(`/dcc/${token}/status`, csrf, {
          status,
          token,
          signature,
          publickey,
          reason
        });
      })
    )
    .then(getResponse);

export const dccComments = (token) =>
  GET(`/dcc/${token}/comments`).then(getResponse);

export const newDccComment = (csrf, dcc) =>
  POST("/dcc/newcomment", csrf, dcc).then(getResponse);

export const cmsUsers = (csrf) => GET("/cmsusers", csrf).then(getResponse);
