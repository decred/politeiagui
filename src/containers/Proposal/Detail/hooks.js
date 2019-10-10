import { useEffect, useState, useCallback } from "react";
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
  editedProposal: sel.apiEditProposalResponse,
  commentID: compose(
    get(["match", "params", "commentid"]),
    arg(1)
  ),
  publicProposals: sel.proposalsWithVoteSummary,
  unvettedProposals: sel.apiUnvettedProposals,
  proposalDetail: sel.proposalWithVoteStatus,
  error: sel.proposalError,
  loading: or(sel.isApiRequestingProposalsVoteSummary, sel.proposalIsRequesting)
};

const mapDispatchToProps = {
  onFetchProposal: act.onFetchProposal,
  onFetchProposalsVoteSummary: act.onFetchProposalsBatchVoteSummary
};

const isEqualProposalToken = (proposal, token) => {
  return (
    proposal &&
    proposal.censorshiprecord &&
    proposal.censorshiprecord.token === token
  );
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
    proposalDetail,
    editedProposal,
    publicProposals,
    unvettedProposals,
    loading,
    onFetchProposal,
    onFetchProposalsVoteSummary,
    commentID: threadParentID
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  const { currentUser } = useLoaderContext();
  const currentUserIsAdmin = currentUser && currentUser.isadmin;
  const currentUserId = currentUser && currentUser.userid;

  const getProposalFromCache = useCallback(() => {
    // try to use the edited proposal from cache first to get the
    // most updated version
    if (isEqualProposalToken(editedProposal, token)) {
      return editedProposal;
    }

    // compare to the current cached proposal detail
    if (isEqualProposalToken(proposalDetail, token)) {
      return proposalDetail;
    }

    // search in the public proposals
    const proposalFromPublic = publicProposals.find(prop =>
      isEqualProposalToken(prop, token)
    );

    if (proposalFromPublic) {
      return proposalFromPublic;
    }

    // search in the unvetted proposals
    const proposalFromUnvetted = unvettedProposals.find(prop =>
      isEqualProposalToken(prop, token)
    );

    if (proposalFromUnvetted) {
      return proposalFromUnvetted;
    }

    return null;
  }, [
    token,
    editedProposal,
    proposalDetail,
    publicProposals,
    unvettedProposals
  ]);

  const getProposal = useCallback(() => {
    const proposal = getProposalFromCache();
    const proposalAuthorID = proposal && proposal.userid;
    const userCannotViewFullProposal =
      !currentUserIsAdmin || currentUserId !== proposalAuthorID;
    if (
      !!proposal &&
      (isCensoredProposal(proposal) || isUnreviewedProposal(proposal)) &&
      userCannotViewFullProposal
    ) {
      return proposal;
    }
    return proposalWithFilesOrNothing(proposal);
  }, [getProposalFromCache, currentUserId, currentUserIsAdmin]);

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
    [getProposalFromCache, proposal, getProposal]
  );

  if (error) {
    throw error;
  }

  return { proposal, loading, threadParentID };
}
