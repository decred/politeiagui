import { makeProposal } from "../../utils";

// Record
const DEFAULT_STATUS = 2;
const DEFAULT_STATE = 2;
const DEFAULT_VERSION = 1;
const DEFAULT_TIMESTAMP = Date.now() / 1000;
const DEFAULT_USERNAME = "user";
const DEFAULT_USERID = "ae2c43af-c093-4f6b-9f54-0844fa1581bb";
const DEFAULT_PUBLIC_KEY =
  "34ff212e32ed363dd8c7df3ee489692c710afe84e8c2b86a315a686d30ab8aa7";
const DEFAULT_SIGNATURE =
  "cfa5a3881567f8f0c9090641894a97482cb2eb6dd2d41b32399ebd5f8012cadbe8b639ae4e003b45fea45169b54f76bd58a269a1947f1727dd357ac38a72cc02";
const DEFAULT_MERKLE =
  "b99cfa6b2b1092914db80d3bcb31a39b7bf59d910ba1318667f6a4d716a44379";
const DEFAULT_TITLE = "Proposal Test";
const DEFAULT_DESCRIPTION = "Description for proposal test";

// Proposal
const DEFAULT_PROPOSAL_TYPE = 1;

const getDefaultUserMd = (
  userid = DEFAULT_USERID,
  pubkey = DEFAULT_PUBLIC_KEY,
  signature = DEFAULT_SIGNATURE,
  id = 1
) => ({
  pluginid: "usermd",
  streamid: id,
  payload: `{"userid":"${userid}","publickey":"${pubkey}","signature":"${signature}"}`
});

const getDefaultRecordMd = (
  token,
  version,
  status,
  timestamp,
  pubkey = DEFAULT_PUBLIC_KEY,
  signature = DEFAULT_SIGNATURE,
  id = 2
) => ({
  pluginid: "usermd",
  streamid: id,
  payload: `{"token":"${token}","version":${version},"status":${status},"publickey":"${pubkey}","signature":"${signature}","timestamp":${timestamp}}`
});

export const makeMockProposalResponse = (
  token,
  {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    state = DEFAULT_STATE,
    status = DEFAULT_STATUS,
    version = DEFAULT_VERSION,
    timestamp = DEFAULT_TIMESTAMP,
    username = DEFAULT_USERNAME,
    type = DEFAULT_PROPOSAL_TYPE,
    rfpLink,
    rfpDeadline,
    attachments
  }
) => ({
  state,
  status,
  version,
  timestamp,
  username,
  metadata: [
    getDefaultUserMd(),
    getDefaultRecordMd(token, version, status, timestamp)
  ],
  files: makeProposal(
    title,
    description,
    rfpDeadline,
    type,
    rfpLink,
    attachments
  ).files,
  censorshiprecord: {
    token,
    merkle: DEFAULT_MERKLE,
    signature: DEFAULT_SIGNATURE
  }
});
