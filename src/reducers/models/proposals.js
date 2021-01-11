import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import get from "lodash/fp/get";
import update from "lodash/fp/update";
import {
  PROPOSAL_STATUS_ABANDONED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  PROPOSAL_STATUS_UNREVIEWED_CHANGES,
  UNREVIEWED,
  VETTEDCENSORED,
  UNVETTEDCENSORED,
  ABANDONED,
  PRE_VOTE,
  ACTIVE_VOTE,
  APPROVED,
  REJECTED,
  PROPOSAL_STATE_UNVETTED
} from "../../constants";
import {
  getIndexMdFromText,
  parseReceivedProposalsMap,
  parseRawProposal
} from "src/helpers";

const DEFAULT_STATE = {
  byToken: {},
  allByStatus: {
    [UNREVIEWED]: [],
    [VETTEDCENSORED]: [],
    [UNVETTEDCENSORED]: [],
    [ABANDONED]: [],
    [PRE_VOTE]: [],
    [ACTIVE_VOTE]: [],
    [APPROVED]: [],
    [REJECTED]: []
  },
  allProposalsByUserId: {},
  numOfProposalsByUserId: {},
  newProposalToken: null
};

// mapReviewStatusToTokenInventoryStatus accepts proposal's status & state and
// returns presentational string status
const mapReviewStatusToTokenInventoryStatus = (status, state) => {
  switch (status) {
    case PROPOSAL_STATUS_UNREVIEWED:
      return UNREVIEWED;
    case PROPOSAL_STATUS_UNREVIEWED_CHANGES:
      return UNREVIEWED;
    case PROPOSAL_STATUS_CENSORED:
      return state === PROPOSAL_STATE_UNVETTED
        ? UNVETTEDCENSORED
        : VETTEDCENSORED;
    case PROPOSAL_STATUS_PUBLIC:
      return PRE_VOTE;
    case PROPOSAL_STATUS_ABANDONED:
      return ABANDONED;
    default:
      throw Error(
        `mapReviewStatusToTokenInventoryStatus: Invalid proposal status: 
      ${status}`
      );
  }
};

const proposalToken = (proposal) => proposal.censorshiprecord.token;

const proposalIndexFile = (name = "", description = "") =>
  getIndexMdFromText([name, description].join("\n\n"));

const updateAllByStatus = (allByStatus, newStatus, tokens) => {
  let res = {};
  tokens.forEach((token) => {
    const updatedByStatus = Object.keys(allByStatus).reduce((inv, key) => {
      const tokens = res[key] || allByStatus[key] || [];
      const foundToken = tokens.find((t) => t === token);
      if (foundToken && key !== newStatus)
        return { ...inv, [key]: tokens.filter((t) => t !== token) };

      if (!foundToken && key === newStatus)
        return { ...inv, [key]: [token].concat(tokens) };

      return { ...inv, [key]: tokens };
    }, res);
    res = {
      ...res,
      ...updatedByStatus
    };
  });
  return res;
};

const updateProposalRfpLinks = (proposal) => (state) => {
  if (!proposal.linkto) return state;
  const linkedProposal = get(["byToken", proposal.linkto])(state);
  if (!linkedProposal) return state;
  return update(["byToken", proposal.linkto, "linkedfrom"], (links) =>
    links ? [...links, proposalToken(proposal)] : [proposalToken(proposal)]
  )(state);
};

const proposals = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_PROPOSALS_BATCH]: () =>
            update("byToken", (proposals) => ({
              ...proposals,
              ...parseReceivedProposalsMap(action.payload.proposals)
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
          [act.RECEIVE_EDIT_PROPOSAL]: () =>
            set(
              ["byToken", proposalToken(action.payload.proposal)],
              parseRawProposal(action.payload.proposal)
            )(state),
          [act.RECEIVE_NEW_PROPOSAL]: () => {
            // creates the index.md file
            const indexFile = proposalIndexFile(
              action.payload.name,
              action.payload.description
            );

            return compose(
              set(
                ["byToken", proposalToken(action.payload)],
                parseRawProposal({
                  ...action.payload,
                  files: [...action.payload.files, indexFile]
                })
              ),
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
              ),
              set("newProposalToken", action.payload.censorshiprecord.token)
            )(state);
          },
          [act.RECEIVE_SETSTATUS_PROPOSAL]: () =>
            compose(
              updateProposalRfpLinks(action.payload.proposal),
              set(
                ["byToken", proposalToken(action.payload.proposal)],
                parseRawProposal(action.payload.proposal)
              ),
              update(["allByStatus"], (allProps) =>
                updateAllByStatus(
                  allProps,
                  mapReviewStatusToTokenInventoryStatus(
                    action.payload.proposal.status,
                    action.payload.proposal.state
                  ),
                  [proposalToken(action.payload.proposal)]
                )
              )
            )(state),
          [act.RECEIVE_USER_PROPOSALS]: () =>
            compose(
              update("byToken", (proposals) => ({
                ...proposals,
                ...parseReceivedProposalsMap(action.payload.proposals)
              })),
              update(
                ["allProposalsByUserId", action.payload.userid],
                (userProposals = []) => [
                  ...userProposals,
                  ...Object.keys(action.payload.proposals)
                ]
              ),
              set(
                ["numOfProposalsByUserId", action.payload.userid],
                action.payload.numofproposals
              )
            )(state),
          [act.RECEIVE_START_VOTE]: () =>
            update("allByStatus", (allProps) =>
              updateAllByStatus(allProps, ACTIVE_VOTE, action.payload.tokens)
            )(state),
          [act.RECEIVE_NEW_COMMENT]: () => {
            const comment = action.payload;
            if (!state.byToken[comment.token]) return state;
            return update(
              ["byToken", comment.token, "numcomments"],
              (numComments) => ++numComments
            )(state);
          },
          [act.RECEIVE_LOGOUT]: () => {
            const privateProps = [
              ...state.allByStatus[UNREVIEWED],
              ...state.allByStatus[VETTEDCENSORED],
              ...state.allByStatus[UNVETTEDCENSORED]
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
              set(["allByStatus", VETTEDCENSORED], []),
              set(["allByStatus", UNVETTEDCENSORED], [])
            )(state);
          }
        }[action.type] || (() => state)
      )();

export default proposals;
