import { useCallback, useMemo, useState, useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useStoreSubscribe, useSelector, useAction } from "src/redux";
import useThrowError from "src/hooks/utils/useThrowError";
import useFetchMachine, {
  VERIFY,
  FETCH,
  REJECT,
  RESOLVE,
  START
} from "src/hooks/utils/useFetchMachine";
import values from "lodash/fp/values";
import compact from "lodash/fp/compact";
import uniq from "lodash/fp/uniq";
import map from "lodash/fp/map";
import reduce from "lodash/fp/reduce";
import flow from "lodash/fp/flow";
import isEmpty from "lodash/fp/isEmpty";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import assign from "lodash/fp/assign";
import {
  getRfpLinkedProposals,
  getTokensForProposalsPagination
} from "src/containers/Proposal/helpers";
import { handleSaveAppDraftProposals } from "src/lib/local_storage";

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

const getRfpLinks = (proposals) =>
  flow(
    values,
    map((p) => p.linkto),
    uniq,
    compact
  )(proposals);

const getRfpSubmissions = (proposals) =>
  flow(
    values,
    reduce((acc, p) => [...acc, ...(p.linkedfrom || [])], []),
    uniq,
    compact
  )(proposals);

const getUnfetchedTokens = (proposals, tokens) =>
  difference(tokens)(keys(proposals));

export function useUserProposals({
  proposalPageSize,
  fetchRfpLinks = true,
  fetchVoteSummary = true,
  fetchProposalSummary = true,
  userID
}) {
  const [remainingTokens, setRemainingTokens] = useState([]);
  const voteSummaries = useSelector(sel.voteSummariesByToken);
  const proposalSummaries = useSelector(sel.proposalSummariesByToken);
  const tokensSelector = useMemo(
    () => sel.makeGetUserProposalsTokens(userID),
    [userID]
  );
  const proposalsSelector = useMemo(
    () => sel.makeGetUserProposals(userID),
    [userID]
  );
  const proposals = useSelector(proposalsSelector);
  const tokensByStatus = useSelector(tokensSelector);
  const tokens = tokensByStatus
    ? [...tokensByStatus.unvetted, ...tokensByStatus.vetted]
    : [];
  const numOfUserProposalsSelector = useMemo(
    () => sel.makeGetNumOfProposalsByUserId(userID),
    [userID]
  );
  const numOfUserProposals = useSelector(numOfUserProposalsSelector);
  const errorSelector = useMemo(
    () => or(sel.apiProposalsBatchError, sel.apiPropsVoteSummaryError),
    []
  );

  const error = useSelector(errorSelector);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchUserProposals = useAction(act.onFetchUserProposals);
  const hasRemainingTokens = !isEmpty(remainingTokens);

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => send(START),
      start: () => {
        if (hasRemainingTokens) return send(VERIFY);
        onFetchUserProposals(userID)
          .catch((e) => send(REJECT, e))
          .then((res) => {
            const resTokens = [...res.unvetted, ...res.vetted];
            if (!resTokens) return send(RESOLVE);
            setRemainingTokens(resTokens);
            return send(VERIFY);
          });
        return send(FETCH);
      },
      verify: () => {
        if (!hasRemainingTokens) return send(RESOLVE, { proposals });
        if (proposals && numOfUserProposals === proposals.length)
          return send(RESOLVE, { proposals });
        const [tokensToFetch, next] = getTokensForProposalsPagination(
          remainingTokens,
          proposalPageSize
        );
        onFetchProposalsBatch({
          tokens: tokensToFetch,
          fetchVoteSummary,
          fetchProposalSummary,
          userid: userID
        })
          .then(([fetchedProposals]) => {
            if (isEmpty(fetchedProposals)) {
              setRemainingTokens(next);
              return send(RESOLVE);
            }
            if (fetchRfpLinks) {
              const rfpLinks = getRfpLinks(fetchedProposals);
              const rfpSubmissions = getRfpSubmissions(fetchedProposals);
              const unfetchedRfpLinks = getUnfetchedTokens(proposals, [
                ...rfpLinks,
                ...rfpSubmissions
              ]);
              if (!isEmpty(unfetchedRfpLinks)) {
                onFetchProposalsBatch({
                  tokens: unfetchedRfpLinks,
                  fetchVoteSummary,
                  fetchProposalSummary,
                  userid: userID
                })
                  .then(() => {
                    const unfetchedTokens = getUnfetchedTokens(
                      assign(proposals, fetchedProposals),
                      tokensToFetch
                    );
                    setRemainingTokens([...unfetchedTokens, ...next]);
                    return send(RESOLVE);
                  })
                  .catch((e) => send(REJECT, e));
                return send(FETCH);
              }
            }
            setRemainingTokens([...next]);
            return send(RESOLVE);
          })
          .catch((e) => send(REJECT, e));
        return send(FETCH);
      },
      done: () => {}
    },
    initialValues: {
      status: "idle",
      loading: true,
      proposals: {},
      proposalsTokens: {},
      verifying: true
    }
  });

  const onFetchMoreProposals = useCallback(() => {
    if (isEmpty(remainingTokens)) return send(START);
    return send(VERIFY);
  }, [send, remainingTokens]);

  const anyError = error || state.error;
  useThrowError(anyError);

  return {
    proposals: proposals
      ? Object.values(
          getRfpLinkedProposals(proposals, voteSummaries, proposalSummaries)
        )
      : [],
    onFetchProposalsBatch,
    proposalsTokens: tokens,
    loading: state.loading,
    verifying: state.verifying,
    onFetchMoreProposals,
    hasMoreProposals: !!remainingTokens.length,
    machineCurrentState: state.status,
    numOfUserProposals
  };
}
