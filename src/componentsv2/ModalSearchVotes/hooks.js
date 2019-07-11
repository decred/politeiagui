import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {
  proposalVoteResults: sel.apiPropVoteResultsResponse,
  loading: sel.isApiRequestingPropVoteResults,
  error: sel.apiPropVoteStatusError
};

const mapDispatchToProps = {
  onFetchProposalVoteResults: act.onFetchProposalVoteResults
};

export const useSearchVotes = (proposalToken, modalOpen) => {
  const {
    onFetchProposalVoteResults,
    proposalVoteResults,
    loading,
    error
  } = useRedux({}, mapStateToProps, mapDispatchToProps);
  useEffect(
    function fetchVotes() {
      if (modalOpen) {
        onFetchProposalVoteResults(proposalToken);
      }
    },
    [proposalToken, modalOpen]
  );

  return {
    votes: proposalVoteResults ? proposalVoteResults.castvotes : [],
    loading,
    error
  };
};
