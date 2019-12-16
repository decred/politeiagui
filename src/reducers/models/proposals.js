import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import update from "lodash/fp/update";
import {
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES
} from "../../constants";

// Proposals presentational status returned by the 'tokeninventory' endpoint
// from the API.
export const UNREVIEWED = "unreviewed";
export const CENSORED = "censored";
export const ABANDONED = "abandoned";
export const PRE_VOTE = "pre";
export const ACTIVE_VOTE = "active";
export const APPROVED = "approved";
export const REJECTED = "rejected";

const DEFAULT_STATE = {
  byToken: {},
  allByStatus: {
    [UNREVIEWED]: [],
    [CENSORED]: [],
    [ABANDONED]: [],
    [PRE_VOTE]: [],
    [ACTIVE_VOTE]: [],
    [APPROVED]: [],
    [REJECTED]: []
  },
  allProposalsByUserId: {},
  numOfProposalsByUserId: {}
};

const mapReviewStatusToTokenInventoryStatus = {
  [PROPOSAL_STATUS_UNREVIEWED]: UNREVIEWED,
  [PROPOSAL_STATUS_UNREVIEWED_CHANGES]: UNREVIEWED,
  [PROPOSAL_STATUS_CENSORED]: CENSORED,
  [PROPOSAL_STATUS_PUBLIC]: PRE_VOTE,
  [PROPOSAL_STATUS_ABANDONED]: ABANDONED
};

const proposalToken = (proposal) => proposal.censorshiprecord.token;

const proposalArrayToByTokenObject = (proposals) =>
  proposals.reduce(
    (proposalsByToken, proposal) => ({
      ...proposalsByToken,
      [proposalToken(proposal)]: proposal
    }),
    {}
  );

const updateAllByStatus = (allByStatus, newStatus, token) =>
  Object.keys(allByStatus).reduce((inv, key) => {
    const tokens = allByStatus[key] || [];
    const foundToken = tokens.find((t) => t === token);
    if (foundToken && key !== newStatus)
      return { ...inv, [key]: tokens.filter((t) => t !== token) };

    if (!foundToken && key === newStatus)
      return { ...inv, [key]: [token].concat(tokens) };

    return { ...inv, [key]: tokens };
  }, {});

const proposals = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_PROPOSALS_BATCH]: () =>
            update("byToken", (proposals) => ({
              ...proposals,
              ...proposalArrayToByTokenObject(action.payload.proposals)
            }))(state),
          [act.RECEIVE_TOKEN_INVENTORY]: () =>
            update("allByStatus", (allProps) => ({
              ...allProps,
              ...Object.keys(action.payload).reduce(
                (res, status) => ({
                  ...res,
                  [status]: action.payload[status] || []
                }),
                {}
              )
            }))(state),
          [act.RECEIVE_PROPOSAL]: () =>
            set(
              ["byToken", proposalToken(action.payload.proposal)],
              action.payload.proposal
            )(state),
          [act.RECEIVE_EDIT_PROPOSAL]: () =>
            set(
              ["byToken", proposalToken(action.payload.proposal)],
              action.payload.proposal
            )(state),
          [act.RECEIVE_NEW_PROPOSAL]: () =>
            compose(
              set(["byToken", proposalToken(action.payload)], action.payload),
              update(["allByStatus", UNREVIEWED], (unreviewdProps = []) =>
                unreviewdProps.concat([proposalToken(action.payload)])
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
            )(state),
          [act.RECEIVE_SETSTATUS_PROPOSAL]: () =>
            compose(
              set(
                ["byToken", proposalToken(action.payload.proposal)],
                action.payload.proposal
              ),
              update(["allByStatus"], (allProps) =>
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
              update("byToken", (proposals) => ({
                ...proposals,
                ...proposalArrayToByTokenObject(action.payload.proposals)
              })),
              update(
                ["allProposalsByUserId", action.payload.userid],
                (userProposals = []) => [
                  ...userProposals,
                  ...action.payload.proposals.map(proposalToken)
                ]
              ),
              set(
                ["numOfProposalsByUserId", action.payload.userid],
                action.payload.numofproposals
              )
            )(state),
          [act.RECEIVE_START_VOTE]: () =>
            update("allByStatus", (allProps) =>
              updateAllByStatus(allProps, ACTIVE_VOTE, action.payload.token)
            )(state),
          [act.RECEIVE_NEW_COMMENT]: () => {
            const comment = action.payload;
            return update(
              ["byToken", comment.token, "numcomments"],
              (numComments) => ++numComments
            )(state);
          },
          [act.RECEIVE_LOGOUT]: () => {
            const privateProps = [
              ...state.allByStatus[UNREVIEWED],
              ...state.allByStatus[CENSORED]
            ];
            const filterPrivateProps = update("byToken", (propsByToken) =>
              Object.keys(propsByToken)
                .filter((key) => !privateProps.includes(key))
                .reduce(
                  (res, token) => ({ ...res, [token]: propsByToken[token] }),
                  {}
                )
            );
            return compose(
              filterPrivateProps,
              set(["allByStatus", UNREVIEWED], []),
              set(["allByStatus", CENSORED], [])
            )(state);
          }
        }[action.type] || (() => state)
      )();

export default proposals;
