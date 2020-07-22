import { useMemo } from "react";
import { equals } from "lodash/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useSelector, useAction } from "src/redux";
import useThrowError from "src/hooks/utils/useThrowError";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import isEmpty from "lodash/isEmpty";
import keys from "lodash/keys";
import values from "lodash/fp/values";
import map from "lodash/fp/map";
import flatten from "lodash/fp/flatten";
import compact from "lodash/fp/compact";
import uniq from "lodash/fp/uniq";
import flow from "lodash/fp/flow";
import difference from "lodash/difference";
import merge from "lodash/merge";

export default function useProposalsBatch(tokens, fetchLinks, isRfp = false) {
  const proposals = useSelector(sel.proposalsByToken);
  const allByStatus = useSelector(sel.allByStatus);
  const errorSelector = useMemo(
    () => or(sel.apiProposalsBatchError, sel.apiPropsVoteSummaryError),
    []
  );
  const error = useSelector(errorSelector);
  const tokenInventory = useSelector(sel.tokenInventory);

  const showLoadingIndicator =
    !tokenInventory || !equals(allByStatus, tokenInventory);

  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);

  const links = useMemo(
    () =>
      !isEmpty(proposals) &&
      flow(
        values,
        map((p) => p && (isRfp ? p.linkto || p.linkedfrom : p.linkto)),
        flatten,
        uniq,
        compact
      )(proposals),
    [proposals, isRfp]
  );

  const remainingLinks = difference(merge(links, tokens), keys(proposals));

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
        if (isEmpty(proposals)) return;
        if (fetchLinks && !isEmpty(remainingLinks)) {
          onFetchProposalsBatch(remainingLinks)
            .then(() => send("VERIFY"))
            .catch((e) => send("REJECT", e));
          return;
        }
        return;
      },
      verify: () => {
        if (fetchLinks && !isEmpty(remainingLinks)) {
          return send("FETCH");
        }
        return send("RESOLVE", { proposals });
      }
    }
  });

  const anyError = error;

  useThrowError(anyError);
  return {
    proposals,
    onFetchProposalsBatch,
    isLoadingTokenInventory: showLoadingIndicator,
    proposalsTokens: allByStatus,
    test: state
  };
}
