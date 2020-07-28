import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";

export function useProposalBillingSummary() {
  const proposalsBilled = useSelector(sel.proposalsBilled);
  const loading = useSelector(sel.isApiRequestingProposalBillingSummary);
  const getSpendingSummary = useAction(act.onGetSpendingSummary);

  return {
    loading,
    proposalsBilled,
    getSpendingSummary
  };
}
