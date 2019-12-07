import { useEffect, useState, useCallback, useMemo } from "react";
import isEqual from "lodash/isEqual";
import { or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import { isUnreviewedProposal, isCensoredProposal } from "../helpers";

const proposalWithFilesOrNothing = (proposal) => {
  return proposal && proposal.files && !!proposal.files.length
    ? proposal
    : null;
};

export function useProposal(token, threadParentID) {
  const error = useSelector(sel.proposalError);
  const loadingSelector = useMemo(
    () => or(sel.isApiRequestingProposalsVoteSummary, sel.proposalIsRequesting),
    []
  );
  const loading = useSelector(loadingSelector);
  const onFetchProposal = useAction(act.onFetchProposal);
  const onFetchProposalsVoteSummary = useAction(
    act.onFetchProposalsBatchVoteSummary
  );
  const proposalSelector = useMemo(() => sel.makeGetProposalByToken(token), [
    token
  ]);
  const proposalFromState = useSelector(proposalSelector);
  const currentUser = useSelector(sel.currentUser);

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

  useEffect(
    function fetchProposal() {
      if (proposal) {
        return;
      }
      onFetchProposal(token);
      onFetchProposalsVoteSummary([token]);
    },
    [proposal, token, onFetchProposal, onFetchProposalsVoteSummary]
  );

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

  return { proposal, loading, threadParentID };
}
