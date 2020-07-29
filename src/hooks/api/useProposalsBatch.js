import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useSelector, useAction } from "src/redux";
import useThrowError from "src/hooks/utils/useThrowError";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { isEmpty, keys, difference, isEqual } from "lodash";
import { values, compact, uniq, flow, map } from "lodash/fp";

const getRfpLinks = (proposals) =>
  flow(
    values,
    map((p) => p.linkto),
    uniq,
    compact
  )(proposals);

const getUnfetchedTokens = (proposals, tokens) =>
  difference(tokens, keys(proposals));

export default function useProposalsBatch(
  tokens,
  fetchRfpLinks,
  fetchVoteSummaries = false
) {
  const proposals = useSelector(sel.proposalsByToken);
  const allByStatus = useSelector(sel.allByStatus);
  const errorSelector = useMemo(
    () => or(sel.apiProposalsBatchError, sel.apiPropsVoteSummaryError),
    []
  );
  const error = useSelector(errorSelector);
  const tokenInventory = useSelector(sel.tokenInventory);

  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);

  const remainingTokens = useMemo(() => {
    return getUnfetchedTokens(proposals, tokens);
  }, [proposals, tokens]);

  const unfetchedRfpLinks = useMemo(() => {
    const rfpLinks = getRfpLinks(proposals);
    return getUnfetchedTokens(proposals, rfpLinks);
  }, [proposals]);

  const missingTokenInventory = isEmpty(tokenInventory);
  const hasRemainingTokens = !isEmpty(remainingTokens);
  const hasUnfetchedRfpLinks = !isEmpty(unfetchedRfpLinks);

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (!tokenInventory && !tokens) {
          onFetchTokenInventory();
          return send("FETCH");
        }
        return send("VERIFY");
      },
      load: () => {
        if (!missingTokenInventory && !tokens) {
          return send("RESOLVE", { proposalsTokens: allByStatus });
        }
        if (
          hasRemainingTokens ||
          (missingTokenInventory && !tokens) ||
          (fetchRfpLinks && hasUnfetchedRfpLinks)
        ) {
          return;
        }
        return send("VERIFY");
      },
      verify: () => {
        if (hasRemainingTokens) {
          onFetchProposalsBatch(remainingTokens, fetchVoteSummaries)
            .then(() => send("VERIFY"))
            .catch((e) => send("REJECT", e));
          return send("FETCH");
        }
        if (fetchRfpLinks && hasUnfetchedRfpLinks) {
          onFetchProposalsBatch(unfetchedRfpLinks, fetchVoteSummaries)
            .then(() => send("VERIFY"))
            .catch((e) => send("REJECT", e));
          return send("FETCH");
        }
        return send("RESOLVE", { proposals, proposalsTokens: allByStatus });
      },
      done: () => {
        if (
          hasRemainingTokens ||
          !isEqual(allByStatus, state.proposalsTokens) ||
          !isEqual(state.proposals, proposals)
        ) {
          return send("VERIFY");
        }
      }
    },
    initialState: {
      status: "idle",
      loading: true,
      proposals: {},
      proposalsTokens: {},
      verifying: true
    }
  });

  console.log(error, state.error);

  const anyError = error || state.error;

  useThrowError(anyError);
  return {
    proposals: state.proposals,
    onFetchProposalsBatch,
    proposalsTokens: state.proposalsTokens,
    loading: state.loading,
    verifying: state.verifying
  };
}
