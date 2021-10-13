import isEmpty from "lodash/fp/isEmpty";
import { useSelector, useAction } from "src/redux";
import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";

export default function useBillingStatusChanges({ tokens }) {
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const onFetchBillingStatusChanges = useAction(
    act.onFetchBillingStatusChanges
  );
  const loading = useSelector(sel.isApiRequestingBillingStatusChanges);
  const billingStatusChangesByToken = useSelector(
    sel.billingStatusChangesByToken
  );
  const billingStatusChangesMissing = isEmpty(billingStatusChangesByToken);
  const hasTokens = !isEmpty(tokens);

  useEffect(() => {
    if (isAdmin && hasTokens && !loading && billingStatusChangesMissing)
      onFetchBillingStatusChanges(tokens);
  });

  return {
    loading
  };
}
