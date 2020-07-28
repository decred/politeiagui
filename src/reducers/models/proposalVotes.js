import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import { PROPOSAL_VOTING_AUTHORIZED } from "src/constants";
import {
  PROPOSAL_VOTING_NOT_AUTHORIZED,
  PROPOSAL_VOTING_ACTIVE
} from "../../constants";

const DEFAULT_STATE = {
  byToken: {},
  bestBlock: null
};

const receiveVoteStatusChange = (state, action, newStatus) =>
  update(["byToken", action.payload.token], (voteSummary) => ({
    ...voteSummary,
    status: newStatus
  }))(state);

const proposalVotes = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_PROPOSALS_VOTE_SUMMARY]: () =>
            compose(
              update("byToken", (voteSummaries) => ({
                ...voteSummaries,
                ...action.payload.summaries
              })),
              set("bestBlock", action.payload.bestblock)
            )(state),
          [act.RECEIVE_AUTHORIZE_VOTE]: () =>
            receiveVoteStatusChange(state, action, PROPOSAL_VOTING_AUTHORIZED),
          [act.RECEIVE_REVOKE_AUTH_VOTE]: () =>
            receiveVoteStatusChange(
              state,
              action,
              PROPOSAL_VOTING_NOT_AUTHORIZED
            ),
          [act.RECEIVE_START_VOTE]: () =>
            receiveVoteStatusChange(state, action, PROPOSAL_VOTING_ACTIVE),
          [act.RECEIVE_PROPOSAL_VOTE_RESULTS]: () =>
            update(["byToken", action.payload.token], (propVotes) => ({
              ...propVotes,
              ...action.payload
            }))(state)
        }[action.type] || (() => state)
      )();

export default proposalVotes;
