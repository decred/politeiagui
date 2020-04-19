import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";

export const useSearchVotes = (proposalToken, modalOpen) => {
  const proposalVoteResults = useSelector(sel.apiPropVoteResultsResponse);
  const loading = useSelector(sel.isApiRequestingPropVoteResults);
  const error = useSelector(sel.proposalVoteResultsError);
  const onFetchProposalVoteResults = useAction(act.onFetchProposalVoteResults);

  useEffect(
    function fetchVotes() {
      if (modalOpen) {
        onFetchProposalVoteResults(proposalToken);
      }
    },
    [proposalToken, modalOpen, onFetchProposalVoteResults]
  );

  return {
    votes: proposalVoteResults ? proposalVoteResults.castvotes : [],
    loading,
    error
  };
};
