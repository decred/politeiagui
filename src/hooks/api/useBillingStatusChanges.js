import { useState } from "react";
import isEmpty from "lodash/fp/isEmpty";
import { useSelector, useAction } from "src/redux";
import take from "lodash/fp/take";
import takeRight from "lodash/fp/takeRight";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { shortRecordToken } from "src/helpers";
import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";

export default function useBillingStatusChanges({ tokens }) {
  const [remainingTokens, setRemainingTokens] = useState([]);
  const hasRemainingTokens = !isEmpty(remainingTokens);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  // Get route page size from pi policy
  const policy = useSelector(sel.policy);
  const pageSize = policy?.pi?.billingstatuschangespagesize;
  const onFetchBillingStatusChanges = useAction(
    act.onFetchBillingStatusChanges
  );
  const loading = useSelector(sel.isApiRequestingBillingStatusChanges);
  const billingStatusChangesByToken = useSelector(
    sel.billingStatusChangesByToken
  );
  const hasTokens = !isEmpty(tokens);

  useEffect(() => {
    if (isAdmin && hasTokens) {
      const missingTokens = tokens.filter((token) =>
        isEmpty(billingStatusChangesByToken[shortRecordToken(token)])
      );
      setRemainingTokens(missingTokens);
    }
  }, [
    billingStatusChangesByToken,
    hasTokens,
    isAdmin,
    loading,
    onFetchBillingStatusChanges,
    tokens
  ]);

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
          console.log(getNextTokensPage(remainingTokens || []));
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
    loading: loading || state.loading
  };
}
