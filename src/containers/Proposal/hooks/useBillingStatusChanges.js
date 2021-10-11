import { useEffect, useState } from "react";
import isEmpty from "lodash/fp/isEmpty";
import take from "lodash/fp/take";
import takeRight from "lodash/fp/takeRight";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { useAction } from "src/redux";
import * as act from "src/actions";
import { isApprovedProposal } from "../helpers";
import { BILLING_STATUS_CHANGES_PAGE_SIZE } from "src/constants";

export default function useBillingStatusChanges({
  proposals = {},
  voteSummaries = {}
}) {
  const [remainingTokens, setRemainingTokens] = useState([]);
  const hasRemainingTokens = !isEmpty(remainingTokens);
  const pageSize = BILLING_STATUS_CHANGES_PAGE_SIZE;

  // Collect tokens of all approved proposals with missing billing
  // status changes metadata.
  const unfetchedBillingStatusChanges = Object.keys(proposals).reduce(
    (tokens, token) => {
      const proposal = proposals[token];
      const voteSummary = voteSummaries[token];
      const isApproved = isApprovedProposal(proposal, voteSummary);
      const hasBillingStatusMetadata = !!proposal.billingStatusChangeMetadata;
      if (isApproved && !hasBillingStatusMetadata) {
        return [...tokens, token];
      }
      return tokens;
    },
    []
  );

  useEffect(() => {
    if (unfetchedBillingStatusChanges && !hasRemainingTokens) {
      setRemainingTokens(unfetchedBillingStatusChanges);
    }
  }, [hasRemainingTokens, unfetchedBillingStatusChanges]);

  const onFetchBillingStatusChanges = useAction(
    act.onFetchBillingStatusChanges
  );

  const getNextTokensPage = (tokens) => [
    take(pageSize)(tokens),
    takeRight(tokens.length - pageSize)(tokens)
  ];

  const [state, send, { START, VERIFY, FETCH, RESOLVE, REJECT }] =
    useFetchMachine({
      actions: {
        initial: () => {
          if (hasRemainingTokens) {
            return send(START);
          }
          return;
        },
        start: () => {
          // fetch first page of comments timestamps
          const [page, remaining] = getNextTokensPage(remainingTokens || []);
          onFetchBillingStatusChanges(page)
            .then(() => {
              setRemainingTokens(remaining);
              return send(VERIFY);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        },
        verify: () => {
          if (!hasRemainingTokens) return send(RESOLVE);
          // fetch remaining timestamps
          const [page, remaining] = getNextTokensPage(remainingTokens);
          onFetchBillingStatusChanges(page)
            .then(() => {
              setRemainingTokens(remaining);
              return send(VERIFY);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
      },
      initialValues: {
        status: "idle",
        loading: false
      }
    });

  return {
    loading: state.loading
  };
}
