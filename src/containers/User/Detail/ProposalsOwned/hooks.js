import * as act from "src/actions";
import * as sel from "src/selectors";
import { useSelector, useAction } from "src/redux";
import { useMemo } from "react";

export function useProposalsOwnedBilling(token) {
  const billingInfoSelector = useMemo(
    () => sel.makeGetBillingInfoByToken(token),
    [token]
  );

  const billingInfo = useSelector(billingInfoSelector);

  const isLoading = useSelector(sel.isApiRequestingProposalOwnerBilling);

  const getProposalBillingInfo = useAction(act.onFetchProposalBilling);

  return {
    billingInfo,
    isLoading,
    getProposalBillingInfo
  };
}
