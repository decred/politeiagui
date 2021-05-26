import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import {
  getProposalRfpLinks,
  getProposalToken,
  getTokensForProposalsPagination
} from "../helpers";
import { getDetailsFile } from "./helpers";
import { shortRecordToken } from "src/helpers";
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
  // compare tokens by short form
  return tokens.filter(
    (t) =>
      !keys(voteSummaries).some(
        (vs) => shortRecordToken(vs) === shortRecordToken(t)
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

export function useProposal(token, threadParentID) {
  const tokenShort = shortRecordToken(token);
  const onFetchProposalDetails = useAction(act.onFetchProposalDetails);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchProposalsVoteSummary = useAction(
    act.onFetchProposalsBatchVoteSummary
  );
  const onFetchVotesDetails = useAction(act.onFetchVotesDetails);
  const proposalSelector = useMemo(
    () => sel.makeGetProposalByToken(tokenShort),
    [tokenShort]
  );
  const proposal = useSelector(proposalSelector);
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.summaryByToken);
  const loadingVoteSummary = useSelector(sel.isApiRequestingVoteSummary);
  const rfpLinks = getProposalRfpLinksTokens(proposal);

  const unfetchedProposalTokens =
    rfpLinks && difference(rfpLinks)(keys(proposals));
  const unfetchedSummariesTokens = getUnfetchedVoteSummaries(
    proposal,
    voteSummaries
  );
  const rfpSubmissions = rfpLinks &&
    proposal.linkby && {
      proposals: values(pick(proposals, rfpLinks)),
      voteSummaries: pick(
        voteSummaries,
        rfpLinks.map((l) => shortRecordToken(l))
      )
    };

  const isRfp = proposal && !!proposal.linkby;
  const isMissingDetails = !(proposal && getDetailsFile(proposal.files));
  const isMissingVoteSummary = !(
    voteSummaries[tokenShort] && voteSummaries[tokenShort].details
  );
  const needsInitialFetch = isRfp || (token && isMissingDetails);

  const [state, send, { FETCH, RESOLVE, VERIFY, REJECT }] = useFetchMachine({
    actions: {
      initial: () => {
        if (needsInitialFetch) {
          onFetchProposalDetails(token)
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
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
          const [tokensBatch] = getTokensForProposalsPagination(
            unfetchedProposalTokens
          );
          onFetchProposalsBatch(tokensBatch, isRfp)
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (
          (!isEmpty(unfetchedSummariesTokens) || isMissingVoteSummary) &&
          proposal?.state === PROPOSAL_STATE_VETTED &&
          !loadingVoteSummary
        ) {
          Promise.all([
            onFetchProposalsVoteSummary(unfetchedSummariesTokens),
            onFetchVotesDetails(token)
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
