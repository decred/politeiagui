import Promise from "promise";
import { useCallback, useMemo, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useSelector, useAction } from "src/redux";
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
import isUndefined from "lodash/fp/isUndefined";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import assign from "lodash/fp/assign";
import {
  INVENTORY_PAGE_SIZE,
  PROPOSAL_PAGE_SIZE,
  PROPOSAL_STATE_UNVETTED,
  PROPOSAL_STATE_VETTED,
  PROPOSAL_STATUS_UNREVIEWED,
  APPROVED
} from "src/constants";
import { shortRecordToken } from "src/helpers";
import {
  getRfpLinkedProposals,
  getProposalStatusLabel,
  getTokensForProposalsPagination
} from "src/containers/Proposal/helpers";

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
  difference(tokens.map((token) => shortRecordToken(token)))(
    keys(proposals).map((token) => shortRecordToken(token))
  );

const getCurrentPage = (tokens) => {
  return tokens ? Math.floor(+tokens.length / INVENTORY_PAGE_SIZE) : 0;
};

const cacheVoteStatus = {};

const updateCacheVoteStatusMap = (voteSummaries, isRefresh) => {
  Object.keys(voteSummaries).forEach((token) => {
    const shortToken = shortRecordToken(token);
    cacheVoteStatus[shortToken] =
      isUndefined(cacheVoteStatus[shortToken]) || isRefresh
        ? voteSummaries[token].status
        : cacheVoteStatus[shortToken];
  });
};

const proposalWithCacheVotetatus = (proposals) => {
  return Object.keys(proposals).reduce((acc, curr) => {
    const shortToken = shortRecordToken(curr);
    return {
      ...acc,
      [shortToken]: {
        ...proposals[curr],
        voteStatus: cacheVoteStatus[shortToken]
      }
    };
  }, {});
};

export default function useProposalsBatch({
  fetchRfpLinks,
  fetchVoteSummary = false,
  fetchProposalSummary = false,
  unvetted = false,
  proposalStatus,
  statuses,
  proposalPageSize = PROPOSAL_PAGE_SIZE
}) {
  const [remainingTokens, setRemainingTokens] = useState([]);
  const [voteStatuses, setStatuses] = useState(statuses);
  const [initializedInventory, setInitializedInventory] = useState(false);
  const isByRecordStatus = isUndefined(voteStatuses);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const proposals = useSelector(sel.proposalsByToken);
  const recordState = unvetted
    ? PROPOSAL_STATE_UNVETTED
    : PROPOSAL_STATE_VETTED;
  const currentStatuses = isByRecordStatus
    ? proposalStatus || [PROPOSAL_STATUS_UNREVIEWED]
    : voteStatuses;
  const [statusIndex, setStatusIndex] = useState(0);
  const currentStatus = useMemo(
    () => currentStatuses[statusIndex],
    [currentStatuses, statusIndex]
  );
  const voteSummaries = useSelector(sel.voteSummariesByToken);
  updateCacheVoteStatusMap(voteSummaries);
  const proposalSummaries = useSelector(sel.proposalSummariesByToken);
  const billingStatusChangesByToken = useSelector(
    sel.billingStatusChangesByToken
  );
  const allByStatus = useSelector(
    isByRecordStatus ? sel.allByRecordStatus : sel.allByVoteStatus
  );

  const status = useMemo(
    () => getProposalStatusLabel(currentStatus, isByRecordStatus),
    [currentStatus, isByRecordStatus]
  );
  console.log({ status, currentStatus, statusIndex });
  const isStatusApproved = status === APPROVED;
  const tokens = useMemo(
    () => allByStatus[status] || [],
    [allByStatus, status]
  );
  const page = useMemo(() => getCurrentPage(tokens), [tokens]);
  const errorSelector = useMemo(
    () => or(sel.apiProposalsBatchError, sel.apiPropsVoteSummaryError),
    []
  );
  const error = useSelector(errorSelector);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);
  const onFetchBillingStatusChanges = useAction(
    act.onFetchBillingStatusChanges
  );
  const hasRemainingTokens = !isEmpty(remainingTokens);

  const scanNextStatusTokens = (index, oldTokens) => {
    const status = currentStatuses[index];
    const newTokens = getUnfetchedTokens(
      proposals,
      uniq(allByStatus[getProposalStatusLabel(status, isByRecordStatus)] || [])
    );

    const tokens = [...oldTokens, ...newTokens];
    if (tokens.length < proposalPageSize && index < currentStatuses.length) {
      return scanNextStatusTokens(index + 1, tokens);
    }

    return {
      // If added no tokens of the new status return old index as the returned
      // tokens are old tokens which means corresponding to the new status.
      index: newTokens?.length ? index : index - 1,
      tokens
    };
  };

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => send(START),
      start: () => {
        if (remainingTokens.length > proposalPageSize) return send(VERIFY);
        // If remaining tokens length is smaller than proposal page size.
        // Find more tokens from inventory or scan from the next status

        // scanNextStatus: inventory is initialized and
        // there are no tokens to be fetched from the next page
        const scanNextStatus =
          initializedInventory &&
          (!(tokens.length % INVENTORY_PAGE_SIZE === 0 && tokens.length > 0) ||
            remainingTokens.length === proposalPageSize);
        if (scanNextStatus) {
          const { index, tokens } = scanNextStatusTokens(
            statusIndex + 1,
            remainingTokens
          );
          console.log({ tokens });
          setStatusIndex(index);
          setRemainingTokens(tokens);
          if (isEmpty(tokens)) return send(RESOLVE);

          return send(VERIFY);
        }

        // Fetch tokens from inventory. Fetch all statuses at the first page.
        // Next times, fetch the next page of the current status.
        onFetchTokenInventory(
          recordState,
          page && currentStatus, // first page fetches all status
          page + 1,
          !isByRecordStatus
        )
          .catch((e) => send(REJECT, e))
          .then(({ votes, records }) => {
            setInitializedInventory(true);
            // prepare token batch to fetch proposal for given status
            const proposalStatusLabel = getProposalStatusLabel(
              currentStatus,
              isByRecordStatus
            );
            const newTokensByStatus = isByRecordStatus ? records : votes;
            const newTokens = newTokensByStatus[proposalStatusLabel];
            const tokens = [...newTokens, ...remainingTokens];
            setRemainingTokens(tokens);

            // Means the current batch request accepts more tokens than
            // the current amount.
            const needsToCompletePaginationBatch =
              tokens.length < proposalPageSize &&
              statusIndex + 1 < currentStatuses.length;

            // can scan more tokens from next status list in order to
            // populate the remainingTokens array and don't lose any token
            const needsNextStatusScan =
              tokens.length === proposalPageSize ||
              needsToCompletePaginationBatch;

            if (needsNextStatusScan) {
              const nextIndex = statusIndex + 1;
              const nextStatus = currentStatuses[nextIndex];
              const nextStatusTokens = getUnfetchedTokens(
                proposals,
                uniq(
                  (page ? allByStatus : newTokensByStatus)[
                    getProposalStatusLabel(nextStatus, isByRecordStatus)
                  ] || []
                )
              );
              setRemainingTokens([...tokens, ...nextStatusTokens]);
              setStatusIndex(nextIndex);

              return send(START);
            }

            return send(VERIFY);
          });

        return send(FETCH);
      },
      verify: () => {
        if (!hasRemainingTokens) return send(RESOLVE, { proposals });
        const [tokensToFetch, next] = getTokensForProposalsPagination(
          remainingTokens,
          proposalPageSize
        );
        // If fetch tokens of approved proposals and current user is admin
        // fetch the billing status changes metadata if doesn't exist in
        // the redux store.
        let missingBillingStatusChangesTokens;
        if (isStatusApproved && isAdmin) {
          missingBillingStatusChangesTokens = tokensToFetch.filter((token) =>
            isEmpty(billingStatusChangesByToken[shortRecordToken(token)])
          );
        }
        console.log({
          missingBillingStatusChangesTokens,
          tokensToFetch,
          isStatusApproved
        });
        Promise.all([
          missingBillingStatusChangesTokens?.length &&
            onFetchBillingStatusChanges(missingBillingStatusChangesTokens),
          onFetchProposalsBatch({
            tokens: tokensToFetch,
            fetchVoteSummary,
            fetchProposalSummary
          })
        ])
          .then(([, [fetchedProposals]]) => {
            if (isEmpty(fetchedProposals)) {
              setRemainingTokens(next);
              return send(RESOLVE);
            }
            const unfetchedTokens = getUnfetchedTokens(
              assign(proposals, fetchedProposals),
              tokensToFetch
            );
            setRemainingTokens([...unfetchedTokens, ...next]);
            if (fetchRfpLinks) {
              const rfpLinks = getRfpLinks(fetchedProposals);
              const rfpSubmissions = getRfpSubmissions(fetchedProposals);
              const unfetchedRfpLinks = getUnfetchedTokens(proposals, [
                ...rfpLinks,
                ...rfpSubmissions
              ]);
              if (!isEmpty(unfetchedRfpLinks)) {
                setRemainingTokens([
                  ...unfetchedRfpLinks,
                  ...unfetchedTokens,
                  ...next
                ]);
                return send(VERIFY);
              }
            }

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

  // onRestartMachine is called when the user clicks on a new tab
  // The function will find out whether the status has been loading in the previous session.
  // If no status is found, all the data is loaded in this tab. Go to the RESOLVE state.
  const onRestartMachine = (newStatuses) => {
    updateCacheVoteStatusMap(voteSummaries, true);
    let unfetchedTokens = [],
      index = 0;
    const statuses = newStatuses || currentStatuses;

    const foundPreviousSessionStatus = statuses.find((status, i) => {
      const statusLabel = getProposalStatusLabel(status, isByRecordStatus);
      unfetchedTokens = getUnfetchedTokens(
        proposals,
        uniq(allByStatus[statusLabel] || [])
      );
      if (unfetchedTokens.length > 0) {
        index = i;
        return true;
      }
      return false;
    });

    setRemainingTokens(unfetchedTokens);
    if (isByRecordStatus) {
      proposalStatus = statuses;
    } else {
      setStatuses(statuses);
    }
    // machine stop condition: inventory loaded, but no tokens to fetch
    if (!foundPreviousSessionStatus) {
      setStatusIndex(statuses.length - 1);
      return send(RESOLVE);
    }
    setStatusIndex(index);
    return send(START);
  };

  const isFetchDone =
    !remainingTokens.length &&
    state.status === "success" &&
    !getUnfetchedTokens(proposals, tokens).length;

  const isAnotherTokensScanningRequired =
    tokens && tokens.length && tokens.length % INVENTORY_PAGE_SIZE === 0;

  const onFetchMoreProposals = useCallback(() => {
    if (remainingTokens.length < proposalPageSize) return send(START);

    return send(VERIFY);
  }, [send, remainingTokens, proposalPageSize]);

  const anyError = error || state.error;
  useThrowError(anyError);

  return {
    proposals: getRfpLinkedProposals(
      proposalWithCacheVotetatus(proposals),
      voteSummaries,
      proposalSummaries
    ),
    onFetchProposalsBatch,
    proposalsTokens: allByStatus,
    // loading is true when fetching cycle is running and there are no
    // proposals fetched to avoid flickering at starting.
    loading:
      state.loading ||
      (!values(proposals).length && statusIndex + 1 < voteStatuses?.length),
    verifying: state.verifying,
    onRestartMachine,
    onFetchMoreProposals,
    hasMoreProposals: !!remainingTokens.length && !!values(proposals).length,
    isProposalsBatchComplete: isFetchDone && !isAnotherTokensScanningRequired,
    machineCurrentState: state.status
  };
}
