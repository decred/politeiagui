import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useRedux, useStoreSubscribe } from "src/redux";
import { handleSaveAppDraftProposals } from "src/lib/local_storage";

export function useDraftProposals() {
  const fromRedux = useRedux(
    {},
    {
      draftProposals: sel.draftProposals
    },
    {
      onLoadDraftProposals: act.onLoadDraftProposals,
      onSaveDraftProposal: act.onSaveDraftProposal,
      onDeleteDraftProposal: act.onDeleteDraftProposal
    }
  );
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

const mapStateToProps = {
  proposals: sel.getUserProposalsWithVoteStatus,
  numOfUserProposals: sel.numOfUserProposals,
  loading: or(sel.userProposalsIsRequesting, sel.isApiRequestingPropsVoteStatus)
};

const mapDisptachToProps = {
  onFetchUserProposals: act.onFetchUserProposalsWithVoteStatus
};

export function useUserProposals(ownProps) {
  const { userID } = ownProps;
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDisptachToProps);

  const { onFetchUserProposals } = fromRedux;

  useEffect(
    function handleFetchUserProposals() {
      onFetchUserProposals(userID);
    },
    [onFetchUserProposals, userID]
  );

  return { ...fromRedux };
}
