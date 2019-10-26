import { useEffect, useState, useCallback, useMemo } from "react";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import isEqual from "lodash/isEqual";
import { arg, or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { useLoaderContext } from "src/Appv2/Loader";
import { isUnreviewedProposal, isCensoredProposal } from "../helpers";

const mapStateToProps = {
  token: compose(
    get(["match", "params", "token"]),
    arg(1)
  ),
  commentID: compose(
    get(["match", "params", "commentid"]),
    arg(1)
  ),
  error: sel.proposalError,
  loading: or(sel.isApiRequestingProposalsVoteSummary, sel.proposalIsRequesting)
};

const mapDispatchToProps = {
  onFetchProposal: act.onFetchProposal,
  onFetchProposalsVoteSummary: act.onFetchProposalsBatchVoteSummary
};

const proposalWithFilesOrNothing = proposal => {
  return proposal && proposal.files && !!proposal.files.length
    ? proposal
    : null;
};

export function useProposal(ownProps) {
  const {
    error,
    token,
    loading,
    onFetchProposal,
    onFetchProposalsVoteSummary,
    commentID: threadParentID
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  const proposalSelector = useMemo(() => sel.makeGetProposalByToken(token), [
    token
  ]);
  const { proposalFromState } = useRedux(
    {},
    { proposalFromState: proposalSelector }
  );

  const { currentUser } = useLoaderContext();
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
