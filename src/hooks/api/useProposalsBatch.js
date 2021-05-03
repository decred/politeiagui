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
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import {
  PROPOSAL_STATE_VETTED,
  PROPOSAL_STATE_UNVETTED,
  INVENTORY_PAGE_SIZE,
  PROPOSAL_PAGE_SIZE
} from "src/constants";
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
  difference(tokens)(keys(proposals));

const getCurrentPage = (tokens) => {
  return tokens ? Math.floor(+tokens.length / INVENTORY_PAGE_SIZE) : 0;
};

export default function useProposalsBatch({
  fetchRfpLinks,
  fetchVoteSummaries = false,
  unvetted = false,
  isByRecordStatus = false,
  proposalStatus,
  proposalPageSize = PROPOSAL_PAGE_SIZE
}) {
  const recordState = useMemo(
    () => (unvetted ? PROPOSAL_STATE_UNVETTED : PROPOSAL_STATE_VETTED),
    [unvetted]
  );

  const [remainingTokens, setRemainingTokens] = useState([]);
  const [status, setStatus] = useState();
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.summaryByToken);
  const allByStatus = useSelector(
    isByRecordStatus ? sel.allByRecordStatus : sel.allByVoteStatus
  );
  const page = useMemo(() => {
    const tokens = allByStatus[getProposalStatusLabel(status, !unvetted)];
    return getCurrentPage(tokens);
  }, [status, unvetted, allByStatus]);

  const [previousPage, setPreviousPage] = useState(0);

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
        onFetchTokenInventory(recordState, status, page + 1, !unvetted)
          .catch((e) => send(REJECT, e))
          .then(({ votes, records }) => {
            // prepare token batch to fetch proposal for given status
            const proposalStatusLabel = getProposalStatusLabel(
              proposalStatus || 1,
              !isByRecordStatus
            );
            setPreviousPage(page);
            const tokens = (!isByRecordStatus ? votes : records)[
              proposalStatusLabel
            ];
            if (!tokens) return send(RESOLVE);
            setRemainingTokens(tokens);
            return send(VERIFY);
          });
        return send(FETCH);
      },
      verify: () => {
        if (hasRemainingTokens) {
          const [fetch, next] = getTokensForProposalsPagination(
            remainingTokens,
            proposalPageSize
          );
          onFetchProposalsBatch(fetch, fetchVoteSummaries)
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
                  onFetchProposalsBatch(unfetchedRfpLinks, fetchVoteSummaries)
                    .then(() => send(RESOLVE))
                    .catch((e) => send(REJECT, e));
                  return send(FETCH);
                }
              }
              const unfetchedTokens = getUnfetchedTokens(proposals, fetch);
              setRemainingTokens([...unfetchedTokens, ...next]);
              return send(RESOLVE);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        return send(RESOLVE, { proposals });
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

  const onRestartMachine = (newStatus) => {
    const newStatusLabel = getProposalStatusLabel(
      !newStatus ? status : newStatus,
      !unvetted
    );
    const unfetchedTokens = getUnfetchedTokens(
      proposals,
      uniq(allByStatus[newStatusLabel] || [])
    );
    if (isEmpty(remainingTokens) && isEmpty(unfetchedTokens) && !page) {
      // stop condition
      return send(RESOLVE);
    }
    setRemainingTokens(unfetchedTokens);
    setStatus(newStatus);
    return send(START);
  };

  const onFetchMoreProposals = useCallback(() => send(VERIFY), [send]);

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
    hasMoreProposals: !!remainingTokens.length,
    machineCurrentState: state.status
  };
}
