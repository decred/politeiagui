import { useEffect, useState, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useStoreSubscribe, useSelector, useAction } from "src/redux";
import { handleSaveAppDraftProposals } from "src/lib/local_storage";
import useThrowError from "src/hooks/utils/useThrowError";

export function useDraftProposals() {
  const draftProposals = useSelector(sel.draftProposals);

  const onLoadDraftProposals = useAction(act.onLoadDraftProposals);
  const onSaveDraftProposal = useAction(act.onSaveDraftProposal);
  const onDeleteDraftProposal = useAction(act.onDeleteDraftProposal);

  const [unsubscribe] = useState(
    useStoreSubscribe(handleSaveAppDraftProposals)
  );

  useEffect(() => {
    // load draft proposals from localStorage
    if (!draftProposals) {
      onLoadDraftProposals();
    }
  }, [onLoadDraftProposals, draftProposals]);

  useEffect(
    function unsubscribeToStore() {
      return unsubscribe;
    },
    [unsubscribe]
  );

  return {
    draftProposals,
    onLoadDraftProposals,
    onSaveDraftProposal,
    onDeleteDraftProposal
  };
}

export function useUserProposals(ownProps) {
  const { userID } = ownProps;

  const proposalsSelector = useMemo(() => sel.makeGetUserProposals(userID), [
    userID
  ]);
  const numOfUserProposalsSelector = useMemo(
    () => sel.makeGetNumOfProposalsByUserId(userID),
    [userID]
  );

  const loadingSelector = useMemo(
    () =>
      or(
        sel.userProposalsIsRequesting,
        sel.isApiRequestingProposalsVoteSummary
      ),
    []
  );

  const errorSelector = useMemo(
    () => or(sel.userProposalsError, sel.apiPropsVoteSummaryError),
    []
  );

  const proposals = useSelector(proposalsSelector);
  const numOfUserProposals = useSelector(numOfUserProposalsSelector);

  const loading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);

  const onFetchUserProposals = useAction(
    act.onFetchUserProposalsWithVoteSummary
  );

  useThrowError(error);

  return {
    proposals,
    numOfUserProposals,
    loading,
    error,
    onFetchUserProposals
  };
}
