import { useEffect, useState, useCallback, useMemo } from "react";
import { or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import {
  isUnreviewedProposal,
  isCensoredProposal,
  getProposalRfpLinks,
  getProposalToken
} from "../helpers";
import { PROPOSAL_STATE_VETTED } from "src/constants";
import useFetchMachine, {
  FETCH,
  RESOLVE,
  VERIFY,
  REJECT
} from "src/hooks/utils/useFetchMachine";
import isEmpty from "lodash/fp/isEmpty";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import isEqual from "lodash/fp/isEqual";
import values from "lodash/fp/values";
import pick from "lodash/pick";
import concat from "lodash/fp/concat";

const proposalWithFilesOrNothing = (proposal) => {
  return proposal && proposal.files && !!proposal.files.length
    ? proposal
    : null;
};

const getUnfetchedVoteSummaries = (proposal, voteSummaries) => {
  const rfpLinks = getProposalRfpLinksTokens(proposal);
  const proposalToken = getProposalToken(proposal);
  const tokens = concat(rfpLinks || [])(proposalToken);
  return difference(tokens)(keys(voteSummaries));
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
  const error = useSelector(sel.proposalError);
  const loadingSelector = useMemo(
    () => or(sel.isApiRequestingProposalsVoteSummary, sel.proposalIsRequesting),
    []
  );
  const loading = useSelector(loadingSelector);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchProposalsVoteSummary = useAction(
    act.onFetchProposalsBatchVoteSummary
  );
  const proposalSelector = useMemo(() => sel.makeGetProposalByToken(token), [
    token
  ]);
  const proposalFromState = useSelector(proposalSelector);
  const currentUser = useSelector(sel.currentUser);
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.summaryByToken);

  const currentUserIsAdmin = currentUser && currentUser.isadmin;
  const currentUserId = currentUser && currentUser.userid;

  const getProposal = useCallback(() => {
    const proposalAuthorID = proposalFromState && proposalFromState.userid;
    const userCannotViewFullProposal =
      !currentUserIsAdmin || currentUserId !== proposalAuthorID;
    const dontNeedToPresentProposalFiles =
      !!proposalFromState &&
      (isCensoredProposal(proposalFromState) ||
        isUnreviewedProposal(proposalFromState)) &&
      userCannotViewFullProposal;
    if (dontNeedToPresentProposalFiles) {
      return proposalFromState;
    }
    return proposalWithFilesOrNothing(proposalFromState);
  }, [proposalFromState, currentUserId, currentUserIsAdmin]);

  const [proposal, setProposal] = useState(getProposal());

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

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (token && !proposal) {
          onFetchProposalsBatch([{ token }], proposalState, true, false)
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
          onFetchProposalsBatch(
            unfetchedProposalTokens.map((token) => ({ token })),
            PROPOSAL_STATE_VETTED,
            false,
            isRfp
          )
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (!isEmpty(unfetchedSummariesTokens)) {
          onFetchProposalsVoteSummary(unfetchedSummariesTokens)
            .then(send(VERIFY))
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

  useEffect(
    function handleProposalChanged() {
      const prop = getProposal();
      if (!!prop && !isEqual(prop, proposal)) {
        setProposal(prop);
      }
    },
    [proposal, getProposal]
  );

  if (error) {
    throw error;
  }

  const proposalWithLinks = getProposalRfpLinks(
    state.proposal,
    state.rfpSubmissions,
    proposals
  );

  return {
    proposal: proposalWithLinks,
    error: state.error,
    loading,
    threadParentID
  };
}
