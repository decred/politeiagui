import { useMemo, useEffect } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useSelector, useAction } from "src/redux";

export function useNewInvoice() {
  const onSubmitInvoice = useAction(act.onSaveNewInvoice);

  return {
    onSubmitInvoice
  };
}

// TODO: this hooks needs to be reviewed since we cannot call the
// proposals token inventory route from the same API when running cms
// this should be fetched either from testnet or mainnet websites
export function useApprovedProposalsTokens() {
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);
  const proposalsTokens = useSelector(sel.allByStatus);
  const approvedProposalsTokens = useMemo(
    () => proposalsTokens && proposalsTokens.approved,
    [proposalsTokens]
  );

  useEffect(() => {
    !proposalsTokens && onFetchTokenInventory();
  }, [onFetchTokenInventory, proposalsTokens]);

  return approvedProposalsTokens;
}
