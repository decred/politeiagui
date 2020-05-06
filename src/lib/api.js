import Promise from "promise";
import "isomorphic-fetch";
import * as pki from "./pki";
import qs from "query-string";
import get from "lodash/fp/get";
import MerkleTree from "./merkle";
import {
  PROPOSAL_STATUS_UNREVIEWED,
  INVOICE_STATUS_UNREVIEWED,
  DCC_STATUS_ACTIVE,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION,
  VOTE_TYPE_STANDARD,
  VOTE_TYPE_RUNOFF
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

export const signRegister = (email, record) => {
  if (typeof email !== "string" || typeof record !== "object") {
    throw Error("signRegister: Invalid params");
  }
  return pki.myPubKeyHex(email).then((publickey) => {
    const digests = [...record.files, ...(record.metadata || [])]
      .map((x) => Buffer.from(get("digest", x), "hex"))
      .sort(Buffer.compare);
    const tree = new MerkleTree(digests);
    const root = tree.getRoot().toString("hex");
    return pki
      .signStringHex(email, root)
      .then((signature) => ({ ...record, publickey, signature }));
  });
};

export const signComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.parentid, comment.comment].join("")
        )
        .then((signature) => ({ ...comment, publickey, signature }))
    );

export const signDcc = (email, dcc) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki
        .signStringHex(email, dcc.digest)
        .then((signature) => ({ file: dcc, publickey, signature }))
    );

export const signDccVote = (email, dccvote) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki
        .signStringHex(email, [dccvote.token, dccvote.vote].join(""))
        .then((signature) => ({ ...dccvote, publickey, signature }))
    );

export const signLikeComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.commentid, comment.action].join("")
        )
        .then((signature) => ({ ...comment, publickey, signature }))
    );

export const signCensorComment = (email, comment) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki
        .signStringHex(
          email,
          [comment.token, comment.commentid, comment.reason].join("")
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

const GET = (path) =>
  fetch(apiBase + path, { credentials: "include" }).then(parseResponse);

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
  pki.generateKeys().then((keys) =>
    pki.loadKeys(email, keys).then(() =>
      pki.myPubKeyHex(email).then((publickey) =>
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
    pki.loadKeys(email, keys).then(() =>
      pki.myPubKeyHex(email).then((publickey) =>
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
    .then((signature) =>
      GET(
        "/v1/user/verify?" +
          qs.stringify({ email, verificationToken, signature })
      )
    )
    .then(getResponse);
};

export const likedComments = (token) =>
  GET(`/v1/user/proposals/${token}/commentslikes`).then(getResponse);

export const proposalPaywallDetails = () =>
  GET("/v1/proposals/paywall").then(getResponse);

export const userProposalCredits = () =>
  GET("/v1/user/proposals/credits").then(getResponse);

export const editUser = (csrf, params) =>
  POST("/user/edit", csrf, params).then(getResponse);

export const manageUser = (csrf, userid, action, reason) =>
  POST("/user/manage", csrf, { userid, action, reason }).then(getResponse);

export const manageCmsUser = (
  csrf,
  userid,
  domain,
  contractortype,
  supervisoruserids
) =>
  POST("/admin/managecms", csrf, {
    userid,
    domain,
    contractortype,
    supervisoruserids
  });

export const verifyUserPayment = () =>
  GET("/v1/user/verifypayment").then(getResponse);

export const login = (csrf, email, password) =>
  POST("/login", csrf, { email, password: digest(password) }).then(getResponse);

// XXXX: this route hasn't been merged into the master of the backend.
// Pull request: https://github.com/decred/politeia/pull/940
export const loginWithUsername = (csrf, username, password) =>
  POST("/login", csrf, { username, password: digest(password) }).then(
    getResponse
  );

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

export const resendVerificationEmailRequest = (csrf, email) =>
  pki
    .generateKeys()
    .then((keys) => pki.loadKeys(email, keys))
    .then(() => pki.myPubKeyHex(email))
    .then((publickey) =>
      POST("/user/new/resend", csrf, { email, publickey }).then(getResponse)
    );

export const updateKeyRequest = (csrf, publickey) =>
  POST("/user/key", csrf, { publickey }).then(getResponse);

export const verifyKeyRequest = (csrf, email, verificationtoken) =>
  pki
    .signStringHex(email, verificationtoken)
    .then((signature) =>
      POST("/user/key/verify", csrf, { signature, verificationtoken }).then(
        getResponse
      )
    );

export const policy = () => GET("/v1/policy").then(getResponse);

export const userProposals = (userid, after) => {
  return !after
    ? GET(`/v1/user/proposals?${qs.stringify({ userid })}`).then(getResponse)
    : GET(`/v1/user/proposals?${qs.stringify({ userid, after })}`).then(
        getResponse
      );
};

export const searchUser = (obj) =>
  GET(`/v1/users?${qs.stringify(obj)}`).then(getResponse);

export const proposal = (token, version = null) =>
  GET(`/v1/proposals/${token}` + (version ? `?version=${version}` : "")).then(
    getResponse
  );

export const proposalsBatch = (csrf, tokens) =>
  POST("/proposals/batch", csrf, { tokens }).then(getResponse);

export const user = (userId) => GET(`/v1/user/${userId}`).then(getResponse);
export const proposalComments = (token) =>
  GET(`/v1/proposals/${token}/comments`).then(getResponse);
export const invoiceComments = (token) =>
  GET(`/v1/invoices/${token}/comments`).then(getResponse);
export const logout = (csrf) =>
  POST("/logout", csrf, {}).then(() => {
    localStorage.removeItem("state");
    return {};
  });

export const proposalSetStatus = (email, csrf, token, status, censorMsg) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki.signStringHex(email, token + status + censorMsg).then((signature) => {
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
    .then((publickey) =>
      pki
        .signStringHex(email, token + version + status + reason)
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

const votePayloadWithType = ({
  type,
  proposalversion,
  duration,
  quorumpercentage,
  passpercentage,
  token
}) => ({
  token,
  proposalversion: +proposalversion,
  type,
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
});

export const startVote = (
  email,
  csrf,
  token,
  duration,
  quorumpercentage,
  passpercentage,
  proposalversion
) => {
  const vote = votePayloadWithType({
    token,
    proposalversion,
    type: VOTE_TYPE_STANDARD,
    duration,
    quorumpercentage,
    passpercentage
  });
  const hash = objectToSHA256(vote);
  return pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki.signStringHex(email, hash).then((signature) =>
        POST(
          "/vote/start",
          csrf,
          {
            vote,
            signature,
            publickey
          },
          "v2"
        )
      )
    )
    .then(getResponse);
};

export const startRunoffVote = (
  email,
  csrf,
  token,
  duration,
  quorumpercentage,
  passpercentage,
  votes // [{ token, proposalVersion }, ...]
) => {
  const submissionsVotes = votes.map((vote) =>
    votePayloadWithType({
      ...vote,
      type: VOTE_TYPE_RUNOFF,
      duration,
      quorumpercentage,
      passpercentage
    })
  );
  return pki
    .myPubKeyHex(email)
    .then(async (publickey) => {
      const voteSignatures = await Promise.all(
        submissionsVotes.map((vote) =>
          pki.signStringHex(email, objectToSHA256(vote))
        )
      );
      const voteAuthSignatures = await Promise.all(
        votes.map(({ token, proposalVersion: version }) =>
          pki.signStringHex(email, `${token}${version}authorize`)
        )
      );
      return POST(
        "/vote/startrunoff",
        csrf,
        {
          startvotes: voteSignatures.map((signature, index) => ({
            vote: submissionsVotes[index],
            signature,
            publickey
          })),
          authorizevotes: voteAuthSignatures.map((signature, index) => ({
            action: "authorize",
            token: votes[index].token,
            signature,
            publickey
          })),
          token
        },
        "v2"
      );
    })
    .then(getResponse);
};

export const proposalsBatchVoteSummary = (csrf, tokens) =>
  POST("/proposals/batchvotesummary", csrf, {
    tokens
  }).then(getResponse);
export const proposalVoteResults = (token) =>
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
    .then((publickey) =>
      pki
        .signStringHex(email, `${token}${version}${action}`)
        .then((signature) =>
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

export const tokenInventory = () =>
  GET("/v1/proposals/tokeninventory").then(getResponse);

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
  GET(`/v1/invoices/${token}` + (version ? `?version=${version}` : "")).then(
    getResponse
  );

export const userInvoices = () => GET("/v1/user/invoices").then(getResponse);

export const adminInvoices = (csrf) =>
  POST("/admin/invoices", csrf, {}).then(getResponse);

export const generatePayouts = (csrf) =>
  POST("/admin/generatepayouts", csrf, {}).then(getResponse);

export const invoicePayouts = (csrf, starttime, endtime) =>
  POST("/admin/invoicepayouts", csrf, { starttime, endtime }).then(getResponse);

export const payApprovedInvoices = () =>
  GET("/v1/admin/payinvoices").then(getResponse);

export const exchangeRate = (csrf, month, year) =>
  POST("/invoices/exchangerate", csrf, { month, year }).then(getResponse);

export const userSubcontractors = (csrf) =>
  GET("/v1/user/subcontractors", csrf).then(getResponse);

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
  GET(`/v1/dcc/${token}`, csrf).then(getResponse);

export const supportOpposeDCC = (csrf, vote) =>
  POST("/dcc/supportoppose", csrf, vote).then(getResponse);

export const setDCCStatus = (csrf, email, token, status, reason) =>
  pki
    .myPubKeyHex(email)
    .then((publickey) =>
      pki.signStringHex(email, token + status + reason).then((signature) => {
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
  GET(`/v1/dcc/${token}/comments`).then(getResponse);

export const newDccComment = (csrf, dcc) =>
  POST("/dcc/newcomment", csrf, dcc).then(getResponse);

export const cmsUsers = (csrf) => GET("/v1/cmsusers", csrf).then(getResponse);
