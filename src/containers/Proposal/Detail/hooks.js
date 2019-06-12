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
  publicProposals: sel.proposalsWithVoteStatus,
  unvettedProposals: sel.apiUnvettedProposals,
  proposalDetail: sel.proposalWithVoteStatus,
  error: sel.proposalError,
  loading: or(sel.proposalIsRequesting, sel.isApiRequestingPropVoteStatus)
};

const mapDispatchToProps = {
  onFetchUser: act.onFetchUser,
  onFetchProposal: act.onFetchProposal,
  onResetProposal: act.onResetProposal,
  onFetchProposalVoteStatus: act.onFetchProposalVoteStatus
};

export function useProposal(ownProps) {
  const {
    error,
    onFetchProposal,
    token,
    proposalDetail,
    publicProposals,
    unvettedProposals,
    loading,
    onResetProposal,
    onFetchProposalVoteStatus
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const [proposal, setProposal] = useState(null);

  function getProposalFromCache() {
    // search in the public proposals
    const proposalFromPublic = publicProposals.find(
      prop => prop.censorshiprecord.token === token
    );

    if (proposalFromPublic) {
      setProposal(proposalFromPublic);
      return true;
    }

    // search in the unvetted proposals
    const proposalFromUnvetted = unvettedProposals.find(
      prop => prop.censorshiprecord.token === token
    );

    if (proposalFromUnvetted) {
      setProposal(proposalFromUnvetted);
      return true;
    }

    return false;
  }

  useEffect(function fetchProposal() {
    // try to get the proposal from the cache before fetching it
    if (getProposalFromCache()) {
      return;
    }

    // proposal was not found in the cache, so we fetch it
    onFetchProposal(token);
    onFetchProposalVoteStatus(token);
    return () => onResetProposal();
  }, []);

  useEffect(
    function receiveFetchedProposal() {
      if (!!proposalDetail && !isEqual(proposalDetail, proposal)) {
        setProposal(proposalDetail);
      }
    },
    [proposalDetail]
  );

  if (error) {
    throw error;
  }

  return { proposal, loading };
}
