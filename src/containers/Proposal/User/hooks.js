import { useEffect, useState, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useStoreSubscribe, useSelector, useAction } from "src/redux";
import { handleSaveAppDraftProposals } from "src/lib/local_storage";
import useThrowError from "src/hooks/utils/useThrowError";
import useFetchMachine, {
  FETCH,
  VERIFY,
  RESOLVE,
  REJECT
} from "src/hooks/utils/useFetchMachine";
import { getProposalToken } from "../helpers";
import isEmpty from "lodash/fp/isEmpty";
import flow from "lodash/fp/flow";
import uniq from "lodash/fp/uniq";
import compact from "lodash/fp/compact";
import map from "lodash/fp/map";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";

const getProposalsWithRfpLinks = (proposals, generalProposals) =>
  proposals &&
  proposals.map((proposal) => {
    if (!proposal.linkto) return proposal;
    const linkedProposal = generalProposals[proposal.linkto];
    const proposedFor = linkedProposal && linkedProposal.name;
    return { ...proposal, proposedFor };
  });

// checks if proposals list from the state machine is incomplete, e.g,
// there are more user proposals on the redux store than the state machine.
const isStateMachineMissingProposals = (state, proposals) =>
  state.proposals && proposals && state.proposals.length !== proposals.length;

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

export function useUserProposals(userID) {
  const proposalsSelector = useMemo(
    () => sel.makeGetUserProposals(userID),
    [userID]
  );
  const numOfUserProposalsSelector = useMemo(
    () => sel.makeGetNumOfProposalsByUserId(userID),
    [userID]
  );
  const loadingSelector = useMemo(
    () =>
      or(
        sel.isApiRequestingUserProposals,
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
  const generalProposals = useSelector(sel.proposalsByToken);
  const loading = useSelector(loadingSelector);
  const error = useSelector(errorSelector);
  const onFetchUserProposals = useAction(act.onFetchUserProposals);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const rfpLinks = flow(
    map((p) => p.linkto),
    uniq,
    compact
  )(proposals);
  const proposalsTokens = useMemo(() => {
    const userProposalsTokens = proposals
      ? proposals.map(getProposalToken)
      : [];
    const generalProposalsTokens = keys(generalProposals);
    return uniq([...userProposalsTokens, ...generalProposalsTokens]);
  }, [proposals, generalProposals]);
  const unfetchedLinks = difference(rfpLinks)(proposalsTokens);

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (isEmpty(proposals)) {
          onFetchUserProposals(userID)
            .then(() => send(VERIFY))
            .catch((err) => send(REJECT, err));
          return send(FETCH);
        }
        return send(VERIFY);
      },
      load: () => {
        if (isEmpty(proposals)) {
          return;
        }
        if (!isEmpty(rfpLinks) && !isEmpty(unfetchedLinks)) {
          return;
        }
        return send(VERIFY);
      },
      verify: () => {
        if (!isEmpty(rfpLinks) && isEmpty(unfetchedLinks)) {
          return send(RESOLVE, {
            proposals: getProposalsWithRfpLinks(proposals, generalProposals)
          });
        }
        if (!isEmpty(rfpLinks) && !isEmpty(unfetchedLinks)) {
          onFetchProposalsBatch(unfetchedLinks, false)
            .then(() => send(VERIFY))
            .catch((err) => send(REJECT, err));
          return send(FETCH);
        }
        return send(RESOLVE, { proposals });
      },
      done: () => {
        // if any proposal is added or removed from use proposals list, verify.
        if (isStateMachineMissingProposals(state, proposals)) {
          return send(VERIFY);
        }
      }
    },
    initialValues: {
      status: "idle",
      loading: true,
      proposals: [],
      verifying: true
    }
  });
  useThrowError(error);
  return {
    proposals: state.proposals,
    numOfUserProposals,
    loading,
    error,
    onFetchUserProposals
  };
}
