import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";

export function useProposalBillingDetails(token) {
  const proposalBillingDetails = useSelector(sel.proposalBillingDetails)(token);
  const loading = useSelector(sel.isApiRequestingProposalBillingDetails);
  const getSpendingDetails = useAction(act.onFetchSpendingDetails);

  return {
    loading,
    proposalBillingDetails,
    getSpendingDetails
  };
}
