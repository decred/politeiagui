import { useEffect, useState, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useRedux, useStoreSubscribe } from "src/redux";
import { handleSaveAppDraftProposals } from "src/lib/local_storage";
import useThrowError from "src/hooks/utils/useThrowError";

export function useDraftProposals() {
  const mapStateToProps = useMemo(
    () => ({
      draftProposals: sel.draftProposals
    }),
    []
  );
  const mapDispatchToProps = useMemo(
    () => ({
      onLoadDraftProposals: act.onLoadDraftProposals,
      onSaveDraftProposal: act.onSaveDraftProposal,
      onDeleteDraftProposal: act.onDeleteDraftProposal
    }),
    []
  );
  const fromRedux = useRedux({}, mapStateToProps, mapDispatchToProps);
  const [unsubscribe] = useState(
    useStoreSubscribe(handleSaveAppDraftProposals)
  );
  const { onLoadDraftProposals, draftProposals } = fromRedux;

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

  return fromRedux;
}

export function useUserProposals(ownProps) {
  const { userID } = ownProps;

  const mapDisptachToProps = useMemo(
    () => ({
      onFetchUserProposals: act.onFetchUserProposalsWithVoteSummary
    }),
    []
  );

  const mapStateToProps = useMemo(() => {
    const proposalsSelector = sel.makeGetUserProposals(userID);
    return {
      proposals: proposalsSelector,
      numOfUserProposals: sel.numOfUserProposals,
      loading: or(
        sel.userProposalsIsRequesting,
        sel.isApiRequestingProposalsVoteSummary
      ),
      error: or(sel.userProposalsError, sel.apiPropsVoteSummaryError)
    };
  }, [userID]);

  const fromRedux = useRedux(ownProps, mapStateToProps, mapDisptachToProps);

  const { error } = fromRedux;

  useThrowError(error);

  return { ...fromRedux };
}
