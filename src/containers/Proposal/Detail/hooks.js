import { useEffect, useState } from "react";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import isEqual from "lodash/isEqual";
import { arg, or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

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
  publicProposals: sel.proposalsWithVoteStatus,
  unvettedProposals: sel.apiUnvettedProposals,
  proposalDetail: sel.proposalWithVoteStatus,
  error: sel.proposalError,
  loading: or(sel.proposalIsRequesting, sel.isApiRequestingPropVoteStatus)
};

const mapDispatchToProps = {
  onFetchUser: act.onFetchUser,
  onFetchProposal: act.onFetchProposal,
  onFetchProposalVoteStatus: act.onFetchProposalVoteStatus
};

const isEqualProposalToken = (proposal, token) => {
  return proposal && proposal.censorshiprecord.token === token;
};

export function useProposal(ownProps) {
  const {
    error,
    onFetchProposal,
    token,
    proposalDetail,
    editedProposal,
    publicProposals,
    unvettedProposals,
    loading,
    onFetchProposalVoteStatus,
    commentID: threadParentID
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  const getProposalFromCache = () => {
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
  };

  const [proposal, setProposal] = useState(getProposalFromCache());

  useEffect(
    function fetchProposal() {
      if (proposal) {
        return;
      }
      onFetchProposal(token);
      onFetchProposalVoteStatus(token);
    },
    [proposal, token, onFetchProposal, onFetchProposalVoteStatus]
  );

  useEffect(
    function receiveFetchedProposal() {
      if (
        !!proposalDetail &&
        isEqualProposalToken(proposalDetail, token) &&
        !isEqual(proposalDetail, proposal)
      ) {
        setProposal(proposalDetail);
      }
    },
    [token, proposalDetail, proposal]
  );

  if (error) {
    throw error;
  }

  return { proposal, loading, threadParentID };
}
