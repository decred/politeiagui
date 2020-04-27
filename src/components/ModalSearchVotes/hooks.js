import { useEffect, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";

export const useSearchVotes = (proposalToken, modalOpen) => {
  const loading = useSelector(sel.isApiRequestingPropVoteResults);
  const error = useSelector(sel.apiPropVoteStatusError);
  const onFetchProposalVoteResults = useAction(act.onFetchProposalVoteResults);
  const proposalVoteResultsSelector = useMemo(
    () => sel.makeGetProposalVoteResults(proposalToken),
    [proposalToken]
  );
  const proposalVoteResults = useSelector(proposalVoteResultsSelector);

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
