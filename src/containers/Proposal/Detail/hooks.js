import { useMemo, useState, useCallback } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import {
  getProposalRfpLinks,
  getProposalToken,
  getTokensForProposalsPagination
} from "../helpers";
import { getDetailsFile } from "./helpers";
import { shortRecordToken, parseRawProposal } from "src/helpers";
import { PROPOSAL_STATE_VETTED } from "src/constants";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { useLoaderContext } from "src/containers/Loader";
import { useComments } from "src/hooks";
import isEmpty from "lodash/fp/isEmpty";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import isEqual from "lodash/fp/isEqual";
import values from "lodash/fp/values";
import pick from "lodash/pick";
import concat from "lodash/fp/concat";

const getUnfetchedVoteSummaries = (proposal, voteSummaries, isSubmission) => {
  if (!proposal) return [];
  // no need to fetch vote summary if its submission
  const rfpLinks = isSubmission ? [] : getProposalRfpLinksTokens(proposal);
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
  const onFetchBatchProposalSummary = useAction(
    act.onFetchBatchProposalSummary
  );
  const proposalSelector = useMemo(
    () => sel.makeGetProposalByToken(tokenShort),
    [tokenShort]
  );
  const proposal = useSelector(proposalSelector);
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.voteSummariesByToken);
  const loadingVoteSummary = useSelector(sel.isApiRequestingVoteSummary);
  const proposalSummaries = useSelector(sel.proposalSummariesByToken);
  const loadingProposalSummary = useSelector(
    sel.isApiRequestingBatchProposalSummary
  );
  const rfpLinks = getProposalRfpLinksTokens(proposal);
  const isRfp = proposal && !!proposal.linkby;
  const isSubmission = proposal && !!proposal.linkto;
  const { currentUser } = useLoaderContext();
  const isCurrentUserProposalAuthor =
    currentUser && proposal && currentUser.userid === proposal.userid;

  const unfetchedProposalTokens =
    rfpLinks &&
    difference(
      rfpLinks.map((r) => shortRecordToken(r)),
      keys(proposals)
    );
  const unfetchedSummariesTokens = getUnfetchedVoteSummaries(
    proposal,
    voteSummaries,
    isSubmission
  );
  const rfpSubmissions = rfpLinks &&
    proposal.linkby && {
      proposals: values(
        pick(
          proposals,
          rfpLinks.map((l) => shortRecordToken(l))
        )
      ),
      voteSummaries: pick(
        voteSummaries,
        rfpLinks.map((l) => shortRecordToken(l))
      ),
      proposalSummaries: pick(
        proposalSummaries,
        rfpLinks.map((l) => shortRecordToken(l))
      )
    };

  const isMissingDetails = !(proposal && getDetailsFile(proposal.files));
  const isMissingVoteSummary = !voteSummaries[tokenShort];
  const isMissingProposalSummary = !proposalSummaries[tokenShort];
  const needsInitialFetch = token && isMissingDetails;

  const [remainingTokens, setRemainingTokens] = useState(
    unfetchedProposalTokens
  );
  const hasRemainingTokens = !isEmpty(remainingTokens);

  const initialValues = {
    status: "idle"
  };

  const [state, send, { FETCH, RESOLVE, VERIFY, REJECT }] = useFetchMachine({
    actions: {
      initial: () => {
        if (needsInitialFetch) {
          onFetchProposalDetails(token)
            .then((res) => {
              const hasToFetchRfpLinks = getProposalRfpLinksTokens(
                parseRawProposal(res)
              );
              setRemainingTokens(hasToFetchRfpLinks);
              send(VERIFY);
            })
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
            (hasRemainingTokens || !isEmpty(unfetchedSummariesTokens)))
        ) {
          return;
        }
        return send(VERIFY);
      },
      verify: () => {
        if (hasRemainingTokens) {
          const [tokensBatch, next] =
            getTokensForProposalsPagination(remainingTokens);
          // Fetch vote & proposal summaries only if the proposal is a RFP.
          // If it is a submission, just grab the records info.
          onFetchProposalsBatch({
            tokens: tokensBatch,
            fetchVoteSummary: isRfp,
            fetchProposalSummary: isRfp,
            fetchProposalsCount: !isSubmission
          })
            .then(() => {
              setRemainingTokens(next);
              return send(VERIFY);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (
          (!isEmpty(unfetchedSummariesTokens) || isMissingVoteSummary) &&
          proposal?.state === PROPOSAL_STATE_VETTED &&
          !loadingVoteSummary
        ) {
          onFetchProposalsVoteSummary(unfetchedSummariesTokens)
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (isMissingProposalSummary && !loadingProposalSummary) {
          onFetchBatchProposalSummary([tokenShort])
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (rfpLinks && rfpSubmissions) {
          // is a RFP
          return send(RESOLVE, { proposal, rfpSubmissions });
        }
        return send(RESOLVE, { proposal });
      },
      done: () => {
        // verify proposal on proposal changes
        // TODO: improve this in the future so we don't need to verify once
        // it should be done.
        if (!isEqual(state.proposal, proposal)) {
          return send(VERIFY);
        }
      }
    },
    initialValues
  });

  const proposalWithLinks = getProposalRfpLinks(
    state.proposal,
    state.rfpSubmissions,
    proposals
  );

  const onReloadProposalDetails = useCallback(
    () => send("RETRY", { status: "idle" }),
    [send]
  );

  const proposalToken = getProposalToken(proposalWithLinks);
  const proposalState = proposalWithLinks?.state;

  const {
    onSubmitComment,
    commentSectionIds,
    hasAuthorUpdates,
    singleThreadRootId,
    error: commentsError,
    loading: commentsLoading
  } = useComments(proposalToken, proposalState, null, threadParentID);

  return {
    proposal: proposalWithLinks,
    error: state.error,
    loading: state.status === "idle" || state.status === "loading",
    threadParentID,
    isCurrentUserProposalAuthor,
    commentSectionIds,
    hasAuthorUpdates,
    singleThreadRootId,
    onSubmitComment,
    commentsError,
    currentUser,
    commentsLoading,
    onReloadProposalDetails
  };
}
