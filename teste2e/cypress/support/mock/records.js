import { makeProposal } from "../../utils";
import { buildRecord, buildProposal } from "../generate";

// Record
const DEFAULT_STATUS = 2;
const DEFAULT_STATE = 2;

const getUserMd = (userid, pubkey, signature) => ({
  pluginid: "usermd",
  payload: `{"userid":"${userid}","publickey":"${pubkey}","signature":"${signature}"}`
});

const getRecordMd = (token, version, status, timestamp, pubkey, signature) => ({
  pluginid: "usermd",
  payload: `{"token":"${token}","version":${version},"status":${status},"publickey":"${pubkey}","signature":"${signature}","timestamp":${timestamp}}`
});

const makeMockProposalResponse = (
  token,
  state = DEFAULT_STATE,
  status = DEFAULT_STATUS,
  version = 1
) => {
  const { timestamp, username, userid, merkle, signature, publickey } =
    buildRecord();
  const { name, description, startDate, endDate, amount, domain } =
    buildProposal();
  return {
    state,
    status,
    version,
    timestamp,
    username,
    metadata: [
      getUserMd(userid, publickey, signature),
      getRecordMd(token, version, status, timestamp, publickey, signature)
    ],
    files: makeProposal({
      name,
      description,
      startDate,
      endDate,
      amount,
      domain
    }).files,
    censorshiprecord: {
      token,
      merkle,
      signature
    }
  };
};

export const middlewares = {
  records: () =>
    cy.intercept("/api/records/v1/records", (req) => {
      const tokens = req.body.requests.map(({ token }) => token);
      const proposals = tokens.reduce(
        (acc, t) => ({
          ...acc,
          [t]: makeMockProposalResponse(t)
        }),
        {}
      );
      req.reply({
        body: { records: proposals }
      });
    })
};
