import CryptoJS from "crypto-js";
import get from "lodash/fp/get";
import * as pki from "./pki";
import MerkleTree from "./merkle";

const PROPOSAL_TYPE_REGULAR = 1;
const PROPOSAL_TYPE_RFP = 2;
const PROPOSAL_TYPE_RFP_SUBMISSION = 3;
const PROPOSAL_METADATA_FILENAME = "proposalmetadata.json";

const UNREVIEWED = "unreviewed";
const ACTIVE_VOTE = "started";
const APPROVED = "approved";
const AUTHORIZED = "authorized";
const UNAUTHORIZED = "unauthorized";
const REJECTED = "rejected";
const INELIGIBLE = "ineligible";
const ARCHIVED = "archived";
const PUBLIC = "public";
const CENSORED = "censored";
const PROPOSAL_VOTING_NOT_AUTHORIZED = 1;
const PROPOSAL_VOTING_AUTHORIZED = 2;
const PROPOSAL_VOTING_ACTIVE = 3;
const PROPOSAL_VOTING_APPROVED = 5;
const PROPOSAL_VOTING_REJECTED = 6;
const PROPOSAL_VOTING_INELIGIBLE = 7;
const PROPOSAL_STATUS_UNREVIEWED = 1;
const PROPOSAL_STATUS_PUBLIC = 2;
const PROPOSAL_STATUS_CENSORED = 3;
const PROPOSAL_STATUS_ARCHIVED = 4;

export const requestWithCsrfToken = (url, body) =>
  cy.request("/api").then((res) =>
    cy.request({
      url,
      body,
      method: "POST",
      encoding: "utf-8",
      headers: {
        "X-Csrf-Token": res.headers["x-csrf-token"]
      }
    })
  );

export const setProposalStatus = (token, status, version, reason) =>
  cy.request("api/v1/user/me").then(({ body: { userid } }) =>
    pki.myPubKeyHex(userid).then((publickey) =>
      pki
        .signStringHex(userid, token + version + status + reason)
        .then((signature) =>
          requestWithCsrfToken("/api/records/v1/setstatus", {
            status,
            version,
            token,
            signature,
            publickey,
            reason
          })
        )
    )
  );

export const utoa = (str) => window.btoa(unescape(encodeURIComponent(str)));

const convertMarkdownToFile = (markdown) => ({
  name: "index.md",
  mime: "text/plain; charset=utf-8",
  payload: utoa(markdown)
});

// Copied from https://stackoverflow.com/a/21797381
export const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Copied from https://stackoverflow.com/a/33918579
export const arrayBufferToWordArray = (ab) => {
  const i8a = new Uint8Array(ab);
  const a = [];
  for (let i = 0; i < i8a.length; i += 4) {
    // eslint-disable-next-line
    a.push(
      (i8a[i] << 24) | (i8a[i + 1] << 16) | (i8a[i + 2] << 8) | i8a[i + 3]
    );
  }
  return CryptoJS.lib.WordArray.create(a, i8a.length);
};

const digestPayload = (payload) =>
  CryptoJS.SHA256(
    arrayBufferToWordArray(base64ToArrayBuffer(payload))
  ).toString(CryptoJS.enc.Hex);

const bufferToBase64String = (buf) => buf.toString("base64");

const objectToBuffer = (obj) => Buffer.from(JSON.stringify(obj));

const convertObjectToUnixTimestamp = ({ day, month, year }) =>
  new Date(Date.UTC(year, month - 1, day, 23, 59)).getTime() / 1000;

const objectToSHA256 = (obj) => {
  const buffer = objectToBuffer(obj);
  const base64 = bufferToBase64String(buffer);
  return digestPayload(base64);
};

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

export const makeProposal = ({
  name,
  amount,
  startdate,
  enddate,
  domain,
  markdown,
  rfpDeadline,
  rfpLink,
  attachments = []
}) => ({
  files: [
    convertMarkdownToFile(name + "\n\n" + markdown),
    {
      //proposal metadata file
      name: PROPOSAL_METADATA_FILENAME,
      mime: "text/plain; charset=utf-8",
      digest: objectToSHA256({ name, amount, startdate, enddate, domain }),
      payload: bufferToBase64String(
        objectToBuffer({ name, amount, startdate, enddate, domain })
      )
    },
    ...(attachments || [])
  ].map(({ name, mime, payload }) => ({
    name,
    mime,
    payload,
    digest: digestPayload(payload)
  }))
});

export const shortRecordToken = (token) => token.substring(0, 7);

export const getProposalStatusLabel = (status, isByRecordStatus) =>
  get(status)(
    isByRecordStatus
      ? {
          [PROPOSAL_STATUS_UNREVIEWED]: UNREVIEWED,
          [PROPOSAL_STATUS_ARCHIVED]: ARCHIVED,
          [PROPOSAL_STATUS_CENSORED]: CENSORED,
          [PROPOSAL_STATUS_PUBLIC]: PUBLIC
        }
      : {
          [PROPOSAL_VOTING_NOT_AUTHORIZED]: UNAUTHORIZED,
          [PROPOSAL_VOTING_AUTHORIZED]: AUTHORIZED,
          [PROPOSAL_VOTING_ACTIVE]: ACTIVE_VOTE,
          [PROPOSAL_VOTING_APPROVED]: APPROVED,
          [PROPOSAL_VOTING_REJECTED]: REJECTED,
          [PROPOSAL_VOTING_INELIGIBLE]: INELIGIBLE
        }
  );
