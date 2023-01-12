import { createSlice } from "@reduxjs/toolkit";
import {
  convertBillingStatusToProposalStatus,
  convertRecordStatusToProposalStatus,
  convertVoteStatusToProposalStatus,
  getRecordStatusChangesMetadata,
  isRfpProposal,
} from "./utils";
import { getTicketvoteSummariesStatusChanges } from "@politeiagui/ticketvote/utils";
import keyBy from "lodash/keyBy";

function mergeStatusChanges(statusChanges, newStatusChanges) {
  const conflicting = Object.keys(newStatusChanges).reduce((scs, token) => {
    const scFromState = statusChanges[token] || {};
    const newSc = newStatusChanges[token];
    return {
      ...scs,
      [token]: { ...scFromState, ...keyBy(newSc, "status") },
    };
  }, {});
  return {
    ...statusChanges,
    ...conflicting,
  };
}

/**
 * getProposalVoteStatusChanges returns status changes for given
 * `voteStatusChangeByToken`, but instead of ticketvote status, a proposal status.
 * @param {Object} voteStatusChangesByToken
 * @param {Object} records records by token
 * @returns {Object} proposal status changes for vote status changes
 */
function getProposalsVoteStatusChanges(voteStatusChangesByToken, records) {
  return Object.keys(voteStatusChangesByToken).reduce(
    (proposalStatusChanges, token) => {
      const record = records[token];
      const vsc = voteStatusChangesByToken[token];
      if (!vsc) return proposalStatusChanges;

      vsc.status = convertVoteStatusToProposalStatus(
        vsc.status,
        record?.status,
        isRfpProposal(record)
      );
      return { ...proposalStatusChanges, [token]: [vsc] };
    },
    {}
  );
}
/**
 * getProposalsRecordStatusChanges returns status changes for each record on
 * `recordsByToken`, but instead of record status, a proposal status.
 * @param {Object} recordsByToken records by token
 * @returns {Object} proposal status changes for records status changes
 */
function getProposalsRecordStatusChanges(recordsByToken) {
  return Object.keys(recordsByToken).reduce((statusChanges, token) => {
    const record = recordsByToken[token];
    const recordStatusChanges = getRecordStatusChangesMetadata(record);
    if (!recordStatusChanges) return statusChanges;
    const proposalStatusChanges = recordStatusChanges.map((rsc) => ({
      ...rsc,
      status: convertRecordStatusToProposalStatus(rsc.status, record.state),
    }));
    return { ...statusChanges, [token]: proposalStatusChanges };
  }, {});
}
/**
 * getProposalsBillingStatusChanges returns status changes for each billing on
 * `billings`, but instead of billing status changes, a proposal status.
 * @param {Object} billings billing status changes
 * @returns {Object} proposal status changes for billing status changes
 */
function getProposalsBillingStatusChanges(billings) {
  return Object.keys(billings).reduce(
    (statusChanges, token) => ({
      ...statusChanges,
      [token]: billings[token].map((bsc) => ({
        ...bsc,
        status: convertBillingStatusToProposalStatus(bsc.status),
      })),
    }),
    {}
  );
}

// TODO: Get parameter from correct env.
const blockTimeMinutes = 2;

export const initialState = {
  statusChangesByToken: {},
};

const proposalsSlice = createSlice({
  name: "piProposals",
  initialState,
  reducers: {
    setVoteStatusChanges: (state, action) => {
      const { summaries: voteSummariesByToken, records } = action.payload;
      if (!voteSummariesByToken) return;
      const voteStatusChangesByToken = getTicketvoteSummariesStatusChanges(
        voteSummariesByToken,
        blockTimeMinutes
      );
      const proposalsStatusChangesByToken = getProposalsVoteStatusChanges(
        voteStatusChangesByToken,
        records
      );
      state.statusChangesByToken = mergeStatusChanges(
        state.statusChangesByToken,
        proposalsStatusChangesByToken
      );
    },
    setRecordStatusChanges: (state, action) => {
      const { records } = action.payload;
      const proposalsStatusChangesByToken =
        getProposalsRecordStatusChanges(records);
      state.statusChangesByToken = mergeStatusChanges(
        state.statusChangesByToken,
        proposalsStatusChangesByToken
      );
    },
    setBillingStatusChanges: (state, action) => {
      const { billings } = action.payload;
      const proposalsStatusChangesByToken =
        getProposalsBillingStatusChanges(billings);
      state.statusChangesByToken = mergeStatusChanges(
        state.statusChangesByToken,
        proposalsStatusChangesByToken
      );
    },
  },
});

export const {
  setVoteStatusChanges,
  setRecordStatusChanges,
  setBillingStatusChanges,
} = proposalsSlice.actions;

// Selectors
export const selectProposalStatusChangesByToken = (state, token) =>
  state.piProposals?.statusChangesByToken[token];
export const selectProposalsStatusChanges = (state) =>
  state.piProposals?.statusChangesByToken;

export default proposalsSlice.reducer;
