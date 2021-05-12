import * as act from "src/actions/types";
import compose from "lodash/fp/compose";
import set from "lodash/fp/set";
import get from "lodash/fp/get";
import update from "lodash/fp/update";
import {
  PROPOSAL_STATUS_ARCHIVED,
  PROPOSAL_STATUS_CENSORED,
  PROPOSAL_STATUS_PUBLIC,
  PROPOSAL_STATUS_UNREVIEWED,
  UNREVIEWED,
  PRE_VOTE,
  ACTIVE_VOTE,
  APPROVED,
  REJECTED,
  PUBLIC,
  CENSORED,
  ARCHIVED,
  INELIGIBLE,
  PROPOSAL_STATE_UNVETTED
} from "../../constants";
import {
  shortRecordToken,
  getIndexMdFromText,
  parseReceivedProposalsMap,
  parseRawProposal
} from "src/helpers";
// TODO: remove legacy
import legacyProposals from "src/legacyproposals.json";

const mapStatusToName = {
  [PROPOSAL_STATUS_UNREVIEWED]: UNREVIEWED,
  [PROPOSAL_STATUS_ARCHIVED]: ARCHIVED,
  [PROPOSAL_STATUS_CENSORED]: CENSORED,
  [PROPOSAL_STATUS_PUBLIC]: PUBLIC
};

const DEFAULT_STATE = {
  byToken: {},
  allByVoteStatus: {
    [PRE_VOTE]: [],
    [ACTIVE_VOTE]: [],
    [APPROVED]: [],
    [REJECTED]: [],
    [INELIGIBLE]: []
  },
  allByRecordStatus: {
    [ARCHIVED]: [],
    [CENSORED]: [],
    [UNREVIEWED]: []
  },
  allProposalsByUserId: {},
  numOfProposalsByUserId: {},
  // TODO: remove legacy
  // In tests legacyProposals.proposals is undefined, thus the need for `|| []`.
  legacyProposals: (legacyProposals.proposals || []).map(
    (p) => shortRecordToken(p.censorshiprecord.token)
  ),
  newProposalToken: null
};

// mapReviewStatusToTokenInventoryStatus accepts proposal's status & state and
// returns presentational string status
const mapReviewStatusToTokenInventoryStatus = (status, state) => {
  switch (status) {
    case PROPOSAL_STATUS_UNREVIEWED:
      return UNREVIEWED;
    case PROPOSAL_STATUS_CENSORED:
      return state !== PROPOSAL_STATE_UNVETTED ? INELIGIBLE : CENSORED;
    case PROPOSAL_STATUS_PUBLIC:
      return PRE_VOTE;
    case PROPOSAL_STATUS_ARCHIVED:
      return state !== PROPOSAL_STATE_UNVETTED ? INELIGIBLE : ARCHIVED;
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

const updateAllByVoteStatus = (allByVoteStatus, newStatus, tokens) => {
  let res = {};
  tokens.forEach((token) => {
    const updatedByStatus = Object.keys(allByVoteStatus).reduce((inv, key) => {
      const tokens = res[key] || allByVoteStatus[key] || [];
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

const updateInventory = (payload) => (allProps) => {
  return {
    ...allProps,
    ...Object.keys(payload).reduce((res, status) => {
      const propsStatus = allProps[status] ? allProps[status] : [];
      const payloadStatus = payload[status] ? payload[status] : [];
      return {
        ...res,
        [status]: [...new Set([...payloadStatus, ...propsStatus])]
      };
    }, {})
  };
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
          [act.RECEIVE_VOTES_INVENTORY]: () =>
            update("allByVoteStatus", updateInventory(action.payload))(state),
          [act.RECEIVE_RECORDS_INVENTORY]: () =>
            update("allByRecordStatus", updateInventory(action.payload))(state),
          [act.RECEIVE_EDIT_PROPOSAL]: () =>
            set(
              [
                "byToken",
                shortRecordToken(
                  action.payload.proposal.censorshiprecord.token
                )
              ],
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
                  files: [...action.payload.files, indexFile],
                  commentsCount: 0
                })
              ),
              update(
                ["allByRecordStatus", UNREVIEWED],
                (unreviewdProps = []) => [
                  proposalToken(action.payload),
                  ...unreviewdProps
                ]
              ),
              update(
                ["allProposalsByUserId", action.payload.userid],
                (userProposals = []) => [
                  proposalToken(action.payload),
                  ...userProposals
                ]
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
                [
                  "byToken",
                  shortRecordToken(proposalToken(action.payload.proposal))
                ],
                parseRawProposal(action.payload.proposal)
              ),
              update(["allByVoteStatus"], (allProps) =>
                updateAllByVoteStatus(
                  allProps,
                  mapReviewStatusToTokenInventoryStatus(
                    action.payload.proposal.status,
                    action.payload.proposal.state
                  ),
                  [shortRecordToken(proposalToken(action.payload.proposal))]
                )
              ),
              update(["allByRecordStatus"], (props) => {
                const statusTokensArray =
                  props[mapStatusToName[action.payload.proposal.status]];
                const proposalToken =
                  shortRecordToken(
                    action.payload.proposal.censorshiprecord.token
                  );
                const newArr = statusTokensArray
                  ? [proposalToken, ...statusTokensArray]
                  : [proposalToken];
                if (!props[mapStatusToName[action.payload.oldStatus]])
                  return {
                    ...props,
                    [mapStatusToName[action.payload.proposal.status]]: newArr
                  };
                return {
                  ...props,
                  [mapStatusToName[action.payload.oldStatus]]: props[
                    mapStatusToName[action.payload.oldStatus]
                  ].filter((p) => p !== proposalToken),
                  [mapStatusToName[action.payload.proposal.status]]: newArr
                };
              })
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
                  ...Object
                    .keys(action.payload.proposals)
                    .map((token) => shortRecordToken(token))
                ]
              ),
              set(
                ["numOfProposalsByUserId", action.payload.userid],
                action.payload.numofproposals
              )
            )(state),
          [act.RECEIVE_START_VOTE]: () =>
            update("allByVoteStatus", (allProps) =>
              updateAllByVoteStatus(
                allProps,
                ACTIVE_VOTE,
                action.payload.tokens
              )
            )(state),
          [act.RECEIVE_NEW_COMMENT]: () => {
            const comment = action.payload;
            if (!state.byToken[comment.token]) return state;
            return update(
              ["byToken", comment.token, "commentsCount"],
              (commentsCount) => ++commentsCount
            )(state);
          },
          [act.RECEIVE_LOGOUT]: () => {
            const privateProps = [
              ...(state.allByRecordStatus[UNREVIEWED] || []),
              ...(state.allByRecordStatus[ARCHIVED] || []),
              ...(state.allByRecordStatus[CENSORED] || [])
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
              set("allByRecordStatus", DEFAULT_STATE.allByRecordStatus)
            )(state);
          }
        }[action.type] || (() => state)
      )();

export default proposals;
