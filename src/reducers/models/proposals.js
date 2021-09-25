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
  AUTHORIZED,
  UNAUTHORIZED,
  REJECTED,
  PUBLIC,
  CENSORED,
  ARCHIVED,
  INELIGIBLE,
  PROPOSAL_STATE_UNVETTED,
  PROPOSAL_STATE_VETTED
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
    [UNAUTHORIZED]: [],
    [AUTHORIZED]: [],
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
  allTokensByUserId: {},
  numOfProposalsByUserId: {},
  // TODO: remove legacy
  // In tests legacyProposals.proposals is undefined, thus the need for `|| []`.
  legacyProposals: (legacyProposals.proposals || []).map((p) =>
    shortRecordToken(p.censorshiprecord.token)
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
  const shortTokens = tokens.map((token) => shortRecordToken(token));
  shortTokens.forEach((token) => {
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
  const linkedProposal = get(["byToken", shortRecordToken(proposal.linkto)])(
    state
  );
  if (!linkedProposal) return state;
  return update(
    ["byToken", shortRecordToken(proposal.linkto), "linkedfrom"],
    (links) =>
      links
        ? [...links, shortRecordToken(proposalToken(proposal))]
        : [shortRecordToken(proposalToken(proposal))]
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
        [status]: [
          ...new Set([
            ...payloadStatus.map((token) => shortRecordToken(token)),
            ...propsStatus
          ])
        ]
      };
    }, {})
  };
};

const onReceiveLogout = (state) =>
  compose(
    update("byToken", (data) => {
      const vetted = {};
      const unvetted = {};
      Object.keys(data).flatMap((id) =>
        data[id].state === PROPOSAL_STATE_VETTED
          ? (vetted[id] = {
              ...data[id]
            })
          : data[id].state === PROPOSAL_STATE_UNVETTED
          ? (unvetted[id] = {
              name: id,
              censorshiprecord: data[id].censorshiprecord,
              userid: data[id].userid,
              username: data[id].username,
              state: data[id].state,
              status: data[id].status,
              files: [],
              timestamp: data[id].timestamp,
              version: data[id].version,
              metadata: data[id].metadata
            })
          : []
      );
      return { ...vetted, ...unvetted };
    }),
    set("allProposalsByUserId", DEFAULT_STATE.allProposalsByUserId),
    set("allTokensByUserId", DEFAULT_STATE.allTokensByUserId),
    set("numOfProposalsByUserId", DEFAULT_STATE.numOfProposalsByUserId)
  )(state);

const proposals = (state = DEFAULT_STATE, action) =>
  action.error
    ? state
    : (
        {
          [act.RECEIVE_PROPOSALS_BATCH]: () => {
            return compose(
              update(["allProposalsByUserId"], (prop) => {
                return {
                  [action.payload.userid]: {
                    ...prop[action.payload.userid],
                    ...parseReceivedProposalsMap(action.payload.proposals)
                  }
                };
              }),
              update("byToken", (proposals) => ({
                ...proposals,
                ...parseReceivedProposalsMap(action.payload.proposals)
              }))
            )(state);
          },
          [act.RECEIVE_VOTES_INVENTORY]: () =>
            update("allByVoteStatus", updateInventory(action.payload))(state),
          [act.RECEIVE_RECORDS_INVENTORY]: () =>
            update("allByRecordStatus", updateInventory(action.payload))(state),
          [act.RECEIVE_EDIT_PROPOSAL]: () =>
            set(
              [
                "byToken",
                shortRecordToken(action.payload.proposal.censorshiprecord.token)
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
                ["byToken", shortRecordToken(proposalToken(action.payload))],
                parseRawProposal({
                  ...action.payload,
                  files: [...action.payload.files, indexFile],
                  commentsCount: 0
                })
              ),
              update(
                ["allByRecordStatus", UNREVIEWED],
                (unreviewdProps = []) => [
                  shortRecordToken(proposalToken(action.payload)),
                  ...unreviewdProps
                ]
              ),
              update(
                ["allProposalsByUserId", action.payload.userid],
                (userProposals = []) => [action.payload, ...userProposals]
              ),
              update(
                ["numOfProposalsByUserId", action.payload.userid],
                (numOfProps = 0) => ++numOfProps
              ),
              set(
                "newProposalToken",
                shortRecordToken(action.payload.censorshiprecord.token)
              )
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
                const proposalToken = shortRecordToken(
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
          [act.RECEIVE_USER_INVENTORY]: () => {
            return compose(
              update(["allTokensByUserId"], () => {
                return {
                  [action.payload.userid]: action.payload.proposals
                };
              }),
              set(
                ["numOfProposalsByUserId", action.payload.userid],
                action.payload.numofproposals
              )
            )(state);
          },
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
          [act.RECEIVE_LOGOUT]: () => onReceiveLogout(state)
        }[action.type] || (() => state)
      )();

export default proposals;
