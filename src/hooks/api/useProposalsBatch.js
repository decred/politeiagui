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
  PROPOSAL_STATUS_UNREVIEWED
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

export default function useProposalsBatch({
  fetchRfpLinks,
  fetchVoteSummaries = false,
  unvetted = false,
  proposalStatus,
  statuses,
  proposalPageSize = PROPOSAL_PAGE_SIZE
}) {
  const [remainingTokens, setRemainingTokens] = useState([]);
  const [voteStatuses, setStatuses] = useState(statuses);
  const [previousPage, setPreviousPage] = useState(0);
  const isByRecordStatus = isUndefined(voteStatuses);
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
  const voteSummaries = useSelector(sel.summaryByToken);
  const allByStatus = useSelector(
    isByRecordStatus ? sel.allByRecordStatus : sel.allByVoteStatus
  );
  const tokens = useMemo(
    () => allByStatus[getProposalStatusLabel(currentStatus, isByRecordStatus)],
    [allByStatus, isByRecordStatus, currentStatus]
  );
  const page = useMemo(() => {
    return getCurrentPage(tokens);
  }, [tokens]);
  const errorSelector = useMemo(
    () => or(sel.apiProposalsBatchError, sel.apiPropsVoteSummaryError),
    []
  );
  const error = useSelector(errorSelector);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);
  const hasRemainingTokens = !isEmpty(remainingTokens);

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => send(START),
      start: () => {
        if (hasRemainingTokens) return send(VERIFY);
        if (page && page === previousPage) return send(RESOLVE);
        setStatusIndex(statusIndex);
        onFetchTokenInventory(
          recordState,
          page && currentStatus, // first page fetches all status
          page + 1,
          !isByRecordStatus
        )
          .catch((e) => send(REJECT, e))
          .then(({ votes, records }) => {
            setPreviousPage(page);
            // prepare token batch to fetch proposal for given status
            const proposalStatusLabel = getProposalStatusLabel(
              currentStatus,
              isByRecordStatus
            );
            const tokens = (isByRecordStatus ? records : votes)[
              proposalStatusLabel
            ];
            if (!tokens) return send(RESOLVE);
            setRemainingTokens(tokens);
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
        onFetchProposalsBatch(tokensToFetch, fetchVoteSummaries)
          .then(([fetchedProposals]) => {
            if (isEmpty(fetchedProposals)) {
              setRemainingTokens(next);
              return send(RESOLVE);
            }
            const unfetchedTokens = getUnfetchedTokens(
              assign(proposals, fetchedProposals),
              tokensToFetch
            );
            // const tokensToFetch = [...unfetchedTokens, ...next]
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
      done: () => {
        if (hasRemainingTokens) {
          // If there are remaining tokens. Go directly to new cycle of fetching
          return send(START);
        }
        // If there are not remaining tokens. Check there are unscanned status or not. If yes, do a new circle of that status
        if (statusIndex + 1 < currentStatuses.length) {
          const newIndex = statusIndex + 1;
          const newStatus = currentStatuses[newIndex];
          const unfetchedTokens = getUnfetchedTokens(
            proposals,
            uniq(
              allByStatus[
                getProposalStatusLabel(newStatus, isByRecordStatus)
              ] || []
            )
          );
          setRemainingTokens(unfetchedTokens);
          setStatusIndex(newIndex);
          return send(START);
        }
      }
    },
    initialValues: {
      status: "idle",
      loading: true,
      proposals: {},
      proposalsTokens: {},
      verifying: true
    }
  });

  // onRestartMachine called when the user clicking on a new tab
  // The function will find what is the status has been loading in the previous session.
  // If there are not status found. That mean all the data are loaded in this tab and go to RESOLVE state
  const onRestartMachine = (newStatuses) => {
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
    if (!foundPreviousSessionStatus) {
      return send(RESOLVE);
    }
    // machine stop condition: inventory loaded, but no tokens to fetch
    setRemainingTokens(unfetchedTokens);
    setStatusIndex(index);
    if (isByRecordStatus) {
      proposalStatus = statuses;
    } else {
      setStatuses(statuses);
    }
    return send(START);
  };

  const isFetchDone =
    !remainingTokens.length &&
    state.status === "success" &&
    !getUnfetchedTokens(proposals, tokens).length;

  const isAnotherInventoryCallRequired =
    tokens && tokens.length && tokens.length % INVENTORY_PAGE_SIZE === 0;

  const onFetchMoreProposals = useCallback(() => {
    if (isEmpty(remainingTokens) && isAnotherInventoryCallRequired)
      return send(START);
    return send(VERIFY);
  }, [send, remainingTokens, isAnotherInventoryCallRequired]);

  const anyError = error || state.error;
  useThrowError(anyError);
  return {
    proposals: getRfpLinkedProposals(proposals, voteSummaries),
    onFetchProposalsBatch,
    proposalsTokens: allByStatus,
    loading: state.loading,
    verifying: state.verifying,
    onRestartMachine,
    onFetchMoreProposals,
    hasMoreProposals: (!!remainingTokens.length) && (!!values(proposals).length),
    isProposalsBatchComplete: isFetchDone && !isAnotherInventoryCallRequired,
    machineCurrentState: state.status
  };
}
