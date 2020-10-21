import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useSelector, useAction } from "src/redux";
import useThrowError from "src/hooks/utils/useThrowError";
import useFetchMachine, {
  VERIFY,
  FETCH,
  REJECT,
  RESOLVE
} from "src/hooks/utils/useFetchMachine";
import values from "lodash/fp/values";
import compact from "lodash/fp/compact";
import uniq from "lodash/fp/uniq";
import map from "lodash/fp/map";
import flow from "lodash/fp/flow";
import isEmpty from "lodash/fp/isEmpty";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import isEqual from "lodash/fp/isEqual";
import { PROPOSAL_STATE_VETTED, PROPOSAL_STATE_UNVETTED } from "src/constants";

const getRfpLinks = (proposals) =>
  flow(
    values,
    map((p) => p.linkto),
    uniq,
    compact
  )(proposals);

const getUnfetchedTokens = (proposals, tokens) =>
  difference(tokens)(keys(proposals));

// XXX add includefiles options param ?
export default function useProposalsBatch(
  tokens,
  { fetchRfpLinks, fetchVoteSummaries = false, unvetted = false }
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

  const remainingTokens = useMemo(() => getUnfetchedTokens(proposals, tokens), [
    proposals,
    tokens
  ]);

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
          onFetchTokenInventory().catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        return send(VERIFY);
      },
      load: () => {
        if (!missingTokenInventory && !tokens) {
          return send(RESOLVE, { proposalsTokens: allByStatus });
        }
        if (
          hasRemainingTokens ||
          (missingTokenInventory && !tokens) ||
          (fetchRfpLinks && hasUnfetchedRfpLinks)
        ) {
          return;
        }
        return send(VERIFY);
      },
      verify: () => {
        if (hasRemainingTokens) {
          onFetchProposalsBatch(
            remainingTokens.map((token) => ({ token })),
            unvetted ? PROPOSAL_STATE_UNVETTED : PROPOSAL_STATE_VETTED,
            false,
            fetchVoteSummaries
          )
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (fetchRfpLinks && hasUnfetchedRfpLinks) {
          onFetchProposalsBatch(
            unfetchedRfpLinks.map((token) => ({ token })),
            unvetted ? PROPOSAL_STATE_UNVETTED : PROPOSAL_STATE_VETTED,
            false,
            fetchVoteSummaries
          )
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        return send(RESOLVE, { proposals, proposalsTokens: allByStatus });
      },
      done: () => {
        if (
          hasRemainingTokens ||
          !isEqual(allByStatus, state.proposalsTokens) ||
          !isEqual(state.proposals, proposals)
        ) {
          return send(VERIFY);
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
