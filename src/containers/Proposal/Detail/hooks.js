import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import { getProposalRfpLinks, getProposalToken } from "../helpers";
import { getDetailsFile } from "./helpers";
import { PROPOSAL_STATE_VETTED } from "src/constants";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import isEmpty from "lodash/fp/isEmpty";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import isEqual from "lodash/fp/isEqual";
import values from "lodash/fp/values";
import pick from "lodash/pick";
import concat from "lodash/fp/concat";

const getUnfetchedVoteSummaries = (proposal, voteSummaries) => {
  if (!proposal) return [];
  const rfpLinks = getProposalRfpLinksTokens(proposal);
  const proposalToken = getProposalToken(proposal);
  const tokens = concat(rfpLinks || [])(proposalToken);
  // compare tokens by substring
  return tokens.filter(
    (t) =>
      !keys(voteSummaries).some(
        (vs) => vs.substring(0, 7) === t.substring(0, 7)
      )
  );
};

const getProposalRfpLinksTokens = (proposal) => {
  if (!proposal) return null;
  const isSubmission = !!proposal.linkto;
  const isRfp = !!proposal.linkby;
  const hasRfpLinks = isSubmission || isRfp;
  if (!hasRfpLinks) return null;
  return isSubmission ? [proposal.linkto] : proposal.linkedfrom;
};

export function useProposal(token, proposalState, threadParentID) {
  const onFetchProposalDetails = useAction(act.onFetchProposalDetails);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchProposalsVoteSummary = useAction(
    act.onFetchProposalsBatchVoteSummary
  );
  const onFetchVotesDetails = useAction(act.onFetchVotesDetails);
  const onFetchProposalVoteResults = useAction(act.onFetchProposalVoteResults);
  const proposalSelector = useMemo(() => sel.makeGetProposalByToken(token), [
    token
  ]);
  const proposal = useSelector(proposalSelector);
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.summaryByToken);

  const rfpLinks = getProposalRfpLinksTokens(proposal);

  const unfetchedProposalTokens =
    rfpLinks && difference(rfpLinks)(keys(proposals));
  const unfetchedSummariesTokens =
    proposalState === PROPOSAL_STATE_VETTED &&
    getUnfetchedVoteSummaries(proposal, voteSummaries);
  const rfpSubmissions = rfpLinks &&
    proposal.linkby && {
      proposals: values(pick(proposals, rfpLinks)),
      voteSummaries: pick(voteSummaries, rfpLinks)
    };

  const isRfp = proposal && !!proposal.linkby;

  const isMissingDetails = !(proposal && getDetailsFile(proposal.files));

  const [state, send, { FETCH, RESOLVE, VERIFY, REJECT }] = useFetchMachine({
    actions: {
      initial: () => {
        if (token && isMissingDetails) {
          onFetchProposalDetails(token)
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          onFetchProposalsVoteSummary([token]);
          onFetchVotesDetails(token);
          onFetchProposalVoteResults(token);
          return send(FETCH);
        }
        return send(VERIFY);
      },
      load: () => {
        if (
          (token && !proposal) ||
          !isEmpty(unfetchedSummariesTokens) ||
          (proposal &&
            rfpLinks &&
            (!isEmpty(unfetchedProposalTokens) ||
              !isEmpty(unfetchedSummariesTokens)))
        ) {
          return;
        }
        return send(VERIFY);
      },
      verify: () => {
        if (!isEmpty(unfetchedProposalTokens)) {
          onFetchProposalsBatch(unfetchedProposalTokens, isRfp)
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (
          !isEmpty(unfetchedSummariesTokens) &&
          proposal?.state === PROPOSAL_STATE_VETTED
        ) {
          Promise.all([
            onFetchProposalsVoteSummary(unfetchedSummariesTokens),
            onFetchVotesDetails(token),
            onFetchProposalVoteResults(token)
          ])
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (rfpLinks && rfpSubmissions) {
          return send(RESOLVE, { proposal, rfpSubmissions });
        }
        return send(RESOLVE, { proposal });
      },
      done: () => {
        // verify proposal on proposal changes
        if (!isEqual(state.proposal, proposal)) {
          return send(VERIFY);
        }
      }
    }
  });

  const proposalWithLinks = getProposalRfpLinks(
    state.proposal,
    state.rfpSubmissions,
    proposals
  );

  return {
    proposal: proposalWithLinks,
    error: state.error,
    loading: state.loading,
    threadParentID
  };
}
