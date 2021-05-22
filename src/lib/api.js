import Promise from "promise";
import "isomorphic-fetch";
import * as pki from "./pki";
import qs from "query-string";
import get from "lodash/fp/get";
import MerkleTree from "./merkle";
import {
  INVOICE_STATUS_UNREVIEWED,
  DCC_STATUS_ACTIVE,
  PROPOSAL_METADATA_FILENAME,
  VOTE_METADATA_FILENAME
} from "../constants";
import { APIUserError, APIPluginError, isAPIWww } from "./errors.js";
import {
  digestPayload,
  digest,
  objectToSHA256,
  utoa,
  objectToBuffer,
  bufferToBase64String
} from "../helpers";

const STATUS_ERR = {
  400: "Bad response from server",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not found"
};

export const TOP_LEVEL_COMMENT_PARENTID = 0;

const apiBase = "/api/";
const apiRecords = `${apiBase}records/`;
const apiTicketVote = `${apiBase}ticketvote/`;
const apiComments = `${apiBase}comments/`;
const apiPi = `${apiBase}pi/`;

const getUrl = (path, version, api = apiBase) => {
  if (!path && !version) return api;
  return `${api}${version}${path}`;
};

const GET = (path, version = "v1", withoutVersion, api = apiBase) =>
  fetch(getUrl(path, !withoutVersion ? version : undefined, api), {
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

const POST = (path, csrf, json, api = apiBase, version = "v1") =>
  fetch(getUrl(path, version, api), getOptions(csrf, json, "POST")).then(
    parseResponse
  );

const PUT = (path, csrf, json, api = apiBase, version = "v1") =>
  fetch(getUrl(path, version, api), getOptions(csrf, json, "PUT")).then(
    parseResponse
  );

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
  linkby = 0,
  type,
  linkto = 0,
  attachments = []
) => ({
  files: [
    convertMarkdownToFile(markdown),
    {
      // Proposal metadata file
      name: PROPOSAL_METADATA_FILENAME,
      mime: "text/plain; charset=utf-8",
      digest: objectToSHA256({ name }),
      payload: bufferToBase64String(objectToBuffer({ name }))
    },
    ...(linkby || linkto
      ? [
          {
            name: VOTE_METADATA_FILENAME,
            mime: "text/plain; charset=utf-8",
            digest: objectToSHA256({ linkto, linkby }),
            payload: bufferToBase64String(objectToBuffer({ linkto, linkby }))
          }
        ]
      : []),
    ...(attachments || [])
  ].map(({ name, mime, payload, digest }) => ({
    name,
    mime,
    payload,
    digest: digest ? digest : digestPayload(payload)
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

export const makeCommentVote = (state, token, vote, commentid) => ({
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
    const digests = record.files
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

const parseResponseBody = (response) =>
  new Promise((resolve, reject) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json"))
      resolve(response.json());
    const err = new Error(
      STATUS_ERR[response.status] || "Internal server error"
    );
    err.internalError = true;
    err.statusCode = response.status;
    reject(err);
  });

export const parseResponse = (response) =>
  new Promise((resolve, reject) =>
    parseResponseBody(response)
      .then((json) => {
        // in case no response body is returned but response is successful
        if (!json && response.status === 200)
          resolve({
            response: {},
            csrfToken: response.headers.get("X-Csrf-Token")
          });
        let errorcode = json.errorcode;
        let errorcontext = json.errorcontext;

        if (isAPIWww(response.url)) {
          errorcode = json.ErrorCode;
          errorcontext = json.ErrorContext;
        }

        if (json.pluginid) {
          reject(new APIPluginError(json.pluginid, errorcode, errorcontext));
        }

        if (errorcode) {
          reject(new APIUserError(response, errorcode, errorcontext));
        }

        if (STATUS_ERR[response.status]) {
          reject(new Error(STATUS_ERR[response.status]));
        }

        resolve({
          response: json,
          csrfToken: response.headers.get("X-Csrf-Token")
        });
      })
      .catch((e) => reject(e))
  );

export const me = () => GET("/user/me").then(getResponse);

export const apiInfo = () =>
  GET("", "", true).then(
    ({
      csrfToken,
      response: { version, route, pubkey, testnet, mode, activeusersession }
    }) => ({
      csrfToken,
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

export const likedComments = (csrf, token, userid) =>
  POST("/votes", csrf, { token, userid }, apiComments).then(getResponse);

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

export const login = (csrf, email, password, code) =>
  POST("/login", csrf, {
    email: email.toLowerCase(),
    password: digest(password),
    code
  }).then(getResponse);

// XXX this route hasn't been merged into the master of the backend.
// Pull request: https://github.com/decred/politeia/pull/940 ???
export const loginWithUsername = (csrf, username, password) =>
  POST("/login", csrf, { username, password: digest(password) }).then(
    getResponse
  );

export const commentVote = (csrf, comment) =>
  POST("/vote", csrf, comment, apiComments).then(getResponse);

export const censorComment = (csrf, comment) =>
  POST("/del", csrf, comment, apiComments).then(getResponse);

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

export const codeStats = (csrf, userid, starttime, endtime) =>
  POST("/user/codestats", csrf, { userid, starttime, endtime }).then(
    getResponse
  );

export const verifyKeyRequest = (csrf, userid, verificationtoken) =>
  pki
    .signStringHex(userid, verificationtoken)
    .then((signature) =>
      POST("/user/key/verify", csrf, { signature, verificationtoken }).then(
        getResponse
      )
    );

export const policyWWW = () => GET("/policy").then(getResponse);

export const policyTicketVote = (csrf) =>
  POST("/policy", csrf, {}, apiTicketVote).then(getResponse);

export const policyComments = (csrf) =>
  POST("/policy", csrf, {}, apiComments).then(getResponse);

export const policyPi = (csrf) =>
  POST("/policy", csrf, {}, apiPi).then(getResponse);

export const userProposals = (csrf, userid) =>
  POST("/userrecords", csrf, { userid }, apiRecords).then(getResponse);

export const searchUser = (obj) =>
  GET(`/users?${qs.stringify(obj)}`).then(getResponse);

export const proposalsBatch = (csrf, payload) =>
  POST("/records", csrf, payload, apiRecords).then(getResponse);

export const proposalDetails = (payload) =>
  POST("/details", "", payload, apiRecords).then(getResponse);

export const user = (userId) => GET(`/user/${userId}`).then(getResponse);

export const proposalComments = (csrf, token) =>
  POST("/comments", csrf, { token }, apiComments).then(getResponse);

export const commentsCount = (tokens) =>
  POST("/count", "", { tokens }, apiComments).then(getResponse);

export const commentsTimestamps = (csrf, token, commentids) =>
  POST("/timestamps", csrf, { token, commentids }, apiComments).then(
    getResponse
  );

export const invoiceComments = (token) =>
  GET(`/invoices/${token}/comments`).then(getResponse);

export const logout = (csrf) => POST("/logout", csrf, {});

export const proposalSetStatus = (
  userid,
  csrf,
  token,
  status,
  version,
  reason
) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      pki
        .signStringHex(userid, token + version + status + reason)
        .then((signature) =>
          POST(
            "/setstatus",
            csrf,
            {
              status,
              version,
              token,
              signature,
              publickey,
              reason
            },
            apiRecords
          )
        )
    )
    .then(getResponse);

export const newProposal = (csrf, proposal) =>
  POST("/new", csrf, proposal, apiRecords).then(getResponse);

export const editProposal = (csrf, proposal) =>
  POST("/edit", csrf, proposal, apiRecords).then(getResponse);

export const newComment = (csrf, comment) =>
  POST("/new", csrf, comment, apiComments).then(getResponse);

export const startVote = (csrf, userid, voteParams) =>
  pki
    .myPubKeyHex(userid)
    .then((publickey) =>
      Promise.all(
        voteParams.map((params) =>
          pki.signStringHex(userid, objectToSHA256(params))
        )
      ).then((signatures) =>
        POST(
          "/start",
          csrf,
          {
            starts: signatures.map((signature, i) => ({
              params: voteParams[i],
              publickey,
              signature
            }))
          },
          apiTicketVote
        )
      )
    )
    .then(getResponse);

export const proposalsBatchVoteSummary = (csrf, tokens) =>
  POST("/summaries", csrf, { tokens }, apiTicketVote).then(getResponse);

export const proposalVoteResults = (csrf, token) =>
  POST("/results", csrf, { token }, apiTicketVote).then(getResponse);

export const proposalVoteDetails = (csrf, token) =>
  POST("/details", csrf, { token }, apiTicketVote).then(getResponse);

export const proposalSubmissions = (token) =>
  POST("/submissions", "", { token }, apiTicketVote).then(getResponse);

export const ticketVoteTimestamps = (csrf, token, votespage) =>
  POST("/timestamps", csrf, { token, votespage }, apiTicketVote).then(
    getResponse
  );

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
          POST(
            "/authorize",
            csrf,
            {
              action,
              token,
              version: +version,
              signature,
              publickey
            },
            apiTicketVote
          )
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

export const proposalsInventory = (page) =>
  POST("/inventory", "", { page }, apiRecords).then(getResponse);

export const votesInventory = (page) =>
  POST("/inventory", "", { page }, apiTicketVote).then(getResponse);

export const recordsTimestamp = (csrf, token, version) =>
  POST("/timestamps", csrf, { token, version }, apiRecords).then(getResponse);

// CMS

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

export const searchCmsUsers = (obj) =>
  GET(`/cmsusers?${qs.stringify(obj)}`).then(getResponse);

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

export const adminInvoices = (csrf, starttime, endtime, userid) =>
  POST("/invoices", csrf, { starttime, endtime, userid }).then(getResponse);

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

export const cmsUsers = (csrf) => GET("/v1/cmsusers", csrf).then(getResponse);

export const setTotp = (csrf, type, code) =>
  POST("/user/totp", csrf, { type, code }).then(getResponse);

export const verifyTotp = (csrf, code) =>
  POST("/user/verifytotp", csrf, { code }).then(getResponse);
