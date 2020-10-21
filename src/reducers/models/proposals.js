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
  PROPOSAL_METADATA_HINT
} from "../../constants";
import { getIndexMdFromText } from "src/helpers";

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
  numOfProposalsByUserId: {},
  newProposalToken: null
};

const mapReviewStatusToTokenInventoryStatus = {
  [PROPOSAL_STATUS_UNREVIEWED]: UNREVIEWED,
  [PROPOSAL_STATUS_UNREVIEWED_CHANGES]: UNREVIEWED,
  [PROPOSAL_STATUS_CENSORED]: CENSORED,
  [PROPOSAL_STATUS_PUBLIC]: PRE_VOTE,
  [PROPOSAL_STATUS_ABANDONED]: ABANDONED
};

const proposalToken = (proposal) => proposal.censorshiprecord.token;

/*const proposalArrayToByTokenObject = (proposals) =>
  proposals.reduce(
    (proposalsByToken, proposal) => ({
      ...proposalsByToken,
      [proposalToken(proposal)]: proposal
    }),
    {}
  );*/

// parseProposalStatuses iterate over proposal's status changes array returned
// from BE and returns proposal's timestamps accordingly
const parseProposalStatuses = (sChanges) => {
  let publishedat = 0,
    censoredat = 0,
    abandonedat = 0;

  sChanges.forEach((sChange) => {
    if (sChange.status === PROPOSAL_STATUS_PUBLIC) {
      publishedat = sChange.timestamp;
    }
    if (sChange.status === PROPOSAL_STATUS_CENSORED) {
      censoredat = sChange.timestamp;
    }
    if (sChange.status === PROPOSAL_STATUS_ABANDONED) {
      abandonedat = sChange.timestamp;
    }
  });
  return { publishedat, censoredat, abandonedat };
};

// parseRawProposal accepts raw proposal object received from BE and parses
// it's metadata & status changes
const parseRawProposal = (proposal) => {
  // Parse statuses
  const { publishedat, censoredat, abandonedat } = parseProposalStatuses(
    proposal.statuses
  );
  // Parse metdata
  // Censored proposal's metadata isn't available
  const metadata =
    proposal.metadata &&
    proposal.metadata.find((md) => md.hint === PROPOSAL_METADATA_HINT);
  const { name, linkby, linkto } = metadata
    ? JSON.parse(atob(metadata.payload))
    : {};
  return {
    ...proposal,
    name,
    linkby,
    linkto,
    publishedat,
    censoredat,
    abandonedat
  };
};

// parseReceivedProposalsMap iterates over BE returned proposals map[token] => proposal, prases the
// metadata file & the proposal statuses
const parseReceivedProposalsMap = (proposals) => {
  const parsedProps = {};
  for (const [token, prop] of Object.entries(proposals)) {
    parsedProps[token] = parseRawProposal(prop);
  }
  return parsedProps;
};

const proposalIndexFile = (name = "", description = "") =>
  getIndexMdFromText([name, description].join("\n\n"));

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
              set(["byToken", proposalToken(action.payload)], {
                ...action.payload,
                files: [...action.payload.files, indexFile]
              }),
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
                ...action.payload.proposals
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
            if (!state.byToken[comment.token]) return state;
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
