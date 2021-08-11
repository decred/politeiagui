import { makeProposal } from "../../utils";
import {
  buildRecord,
  buildProposal,
  makeCustomInventoryByStatus
} from "../generate";
import { getProposalStatusLabel, getProposalStateLabel } from "../../utils";
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
  const { name, description } = buildProposal();
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
    files: makeProposal({ name, description }).files,
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
    }),
  inventory: (tokensAmountByStatus, state = 1) =>
    cy.intercept("/api/records/v1/inventory", (req) => {
      const inv = makeCustomInventoryByStatus(
        tokensAmountByStatus || {
          censored: 7,
          unreviewed: 8
        }
      );
      const recordState = getProposalStateLabel(state);
      if (!req.body.status) {
        const tokens = Object.keys(inv).reduce(
          (acc, status) => ({
            ...acc,
            [status]: inv[status][0]
          }),
          {}
        );
        req.reply({
          body: {
            bestBlock: 718066,
            [recordState]: tokens
          }
        });
      } else {
        const statusLabel = getProposalStatusLabel(req.body.status, true);
        req.reply({
          body: {
            bestBlock: 718066,
            [recordState]: {
              [statusLabel]:
                inv[statusLabel][req.body.page ? req.body.page - 1 : 0]
            }
          }
        });
      }
    })
};
