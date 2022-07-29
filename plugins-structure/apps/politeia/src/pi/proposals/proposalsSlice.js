import { createSlice } from "@reduxjs/toolkit";
import {
  convertBillingStatusToProposalStatus,
  convertRecordStatusToProposalStatus,
  convertVoteStatusToProposalStatus,
  getRecordStatusChangesMetadata,
} from "./utils";
import { getTicketvoteSummariesStatusChanges } from "@politeiagui/ticketvote/utils";
import keyBy from "lodash/keyBy";

export const initialState = {
  statusChangesByToken: {},
};

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

// TODO: Get parameter from correct env.
const blockTimeMinutes = 2;

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
      const proposalsStatusChangesByToken = Object.keys(
        voteStatusChangesByToken
      ).reduce((proposalStatusChanges, token) => {
        const record = records[token];
        return {
          ...proposalStatusChanges,
          [token]: voteStatusChangesByToken[token].map((vsc) => ({
            ...vsc,
            status: convertVoteStatusToProposalStatus(
              vsc.status,
              record?.status
            ),
          })),
        };
      }, {});
      state.statusChangesByToken = mergeStatusChanges(
        state.statusChangesByToken,
        proposalsStatusChangesByToken
      );
    },
    setRecordStatusChanges: (state, action) => {
      const { records } = action.payload;
      const proposalsStatusChangesByToken = Object.keys(records).reduce(
        (statusChanges, token) => {
          const record = records[token];
          const recordStatusChanges = getRecordStatusChangesMetadata(record);
          if (!recordStatusChanges) return statusChanges;
          const proposalStatusChanges = recordStatusChanges.map((rsc) => ({
            ...rsc,
            status: convertRecordStatusToProposalStatus(
              rsc.status,
              record.state
            ),
          }));
          return { ...statusChanges, [token]: proposalStatusChanges };
        },
        {}
      );
      state.statusChangesByToken = mergeStatusChanges(
        state.statusChangesByToken,
        proposalsStatusChangesByToken
      );
    },
    setBillingStatusChanges: (state, action) => {
      const { billings } = action.payload;
      const proposalsStatusChangesByToken = Object.keys(billings).reduce(
        (statusChanges, token) => ({
          ...statusChanges,
          [token]: billings[token].map((bsc) => ({
            ...bsc,
            status: convertBillingStatusToProposalStatus(bsc.status),
          })),
        }),
        {}
      );
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
