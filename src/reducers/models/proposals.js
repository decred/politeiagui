import * as act from "src/actions/types";
// import cloneDeep from "lodash/cloneDeep";
// import unionBy from "lodash/unionBy";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import {
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES
  // PROPOSAL_VOTING_ACTIVE,
  // PROPOSAL_VOTING_AUTHORIZED,
  // PROPOSAL_VOTING_NOT_AUTHORIZED
} from "../../constants";

// const mapVotingStatusToTokenInventoryStatus = {
//   [PROPOSAL_VOTING_NOT_AUTHORIZED]: "pre",
//   [PROPOSAL_VOTING_AUTHORIZED]: "pre",
//   [PROPOSAL_VOTING_ACTIVE]: "active"
// };

const DEFAULT_STATE = {
  byToken: {},
  allByStatus: {
    unreviewed: [],
    censored: [],
    abandoned: [],
    pre: [],
    active: [],
    approved: [],
    rejected: []
  },
  allProposalsByUserId: {},
  numOfProposalsByUserId: {}
};

const proposalToken = proposal => proposal.censorshiprecord.token;

const mapReviewStatusToTokenInventoryStatus = {
  [PROPOSAL_STATUS_UNREVIEWED]: "unreviewed",
  [PROPOSAL_STATUS_UNREVIEWED_CHANGES]: "unreviewed",
  [PROPOSAL_STATUS_CENSORED]: "censored",
  [PROPOSAL_STATUS_PUBLIC]: "pre",
  [PROPOSAL_STATUS_ABANDONED]: "abandoned"
};

const updateAllByStatus = (allByStatus, newStatus, token) =>
  Object.keys(allByStatus).reduce((inv, key) => {
    const tokens = allByStatus[key] || [];
    const foundToken = tokens.find(t => t === token);
    if (foundToken && key !== newStatus)
      return { ...inv, [key]: tokens.filter(t => t !== token) };

    if (!foundToken && key === newStatus)
      return { ...inv, [key]: [token].concat(tokens) };

    return { ...inv, [key]: tokens };
  }, {});

const proposals = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : ({
        [act.RECEIVE_PROPOSALS_BATCH]: () =>
          update("byToken", proposals => ({
            ...proposals,
            ...action.payload.proposals
          }))(state),
        [act.RECEIVE_TOKEN_INVENTORY]: () =>
          update("allByStatus", allProps => ({
            ...allProps,
            ...action.payload
          }))(state),
        [act.RECEIVE_PROPOSAL]: () =>
          set(
            ["byToken", proposalToken(action.payload.proposal)],
            action.payload.proposal
          )(state),
        [act.RECEIVE_NEW_PROPOSAL]: () => {
          try {
            return compose(
              set(["byToken", proposalToken(action.payload)], action.payload),
              update(["allByStatus", "unreviewed"], (unreviewdProps = []) =>
                unreviewdProps.concat([action.payload])
              ),
              update(
                ["allProposalsByUserId", action.payload.userid],
                (userProposals = []) =>
                  userProposals.concat([proposalToken(action.payload)])
              ),
              update(
                ["numOfProposalsByUserId", action.payload.userid],
                (numOfProps = 0) => ++numOfProps
              )
            )(state);
          } catch (e) {
            console.log("GOT ERROR", e);
          }
          return state;
        },
        [act.RECEIVE_SETSTATUS_PROPOSAL]: () =>
          compose(
            set(
              ["byToken", proposalToken(action.payload.proposal)],
              action.payload.proposal
            ),
            update(["allByStatus"], allProps =>
              updateAllByStatus(
                allProps,
                mapReviewStatusToTokenInventoryStatus[
                  action.payload.proposal.status
                ],
                proposalToken(action.payload.proposal)
              )
            )
          )(state),
        [act.RECEIVE_USER_PROPOSALS]: () =>
          compose(
            update("byToken", proposals => ({
              ...proposals,
              ...action.payload.proposals.reduce(
                (userProposalsByToken, userProposal) => ({
                  ...userProposalsByToken,
                  [proposalToken(userProposal)]: userProposal
                }),
                {}
              )
            })),
            set(
              ["allProposalsByUserId", action.payload.userid],
              action.payload.proposals.map(proposalToken)
            ),
            set(
              ["numOfProposalsByUserId", action.payload.userid],
              action.payload.numofproposals
            )
          )(state)
      }[action.type] || (() => state))();

export default proposals;
