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

  const remainingLinks = difference(
    merge(fetchLinks && links ? links : [], tokens),
    keys(proposals)
  );

  const missingProposals = isEmpty(proposals);
  const missingTokenInventory = isEmpty(tokenInventory);
  const hasRemainingLinks = !isEmpty(remainingLinks);

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (!tokenInventory && !tokens) {
          return send("FETCH");
        }
        return send("VERIFY");
      },
      load: () => {
        if (missingProposals && missingTokenInventory) {
          onFetchTokenInventory()
            .then(() => send("VERIFY"))
            .catch((e) => send("REJECT", e));
        }
        if (hasRemainingLinks) {
          onFetchProposalsBatch(remainingLinks)
            .then(() => send("VERIFY"))
            .catch((e) => send("REJECT", e));
        }
        if (!missingTokenInventory && missingProposals && !tokens) {
          console.log("nao tinha token pra carregar, retorna o inventory");
          return send("RESOLVE", { proposalsTokens: allByStatus });
        }
        return;
      },
      verify: () => {
        if (hasRemainingLinks || missingProposals) {
          return send("FETCH");
        }
        console.log("agora é pra carregar as proposals");
        return send("RESOLVE", { proposals, proposalsTokens: allByStatus });
      },
      done: () => {
        if (hasRemainingLinks) {
          return send("FETCH");
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

  const anyError = error;

  useThrowError(anyError);
  return {
    proposals: state.proposals,
    onFetchProposalsBatch,
    isLoadingTokenInventory: showLoadingIndicator,
    proposalsTokens: state.proposalsTokens,
    test: state
  };
}
