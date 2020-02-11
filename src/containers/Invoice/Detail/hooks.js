import { useMemo, useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";

export function useInvoice(invoiceToken) {
  const invoiceSelector = useMemo(
    () => sel.makeGetInvoiceByToken(invoiceToken),
    [invoiceToken]
  );
  const invoice = useSelector(invoiceSelector);
  const onFetchInvoice = useAction(act.onFetchInvoice);
  const requestParams = useMemo(() => [invoiceToken], [invoiceToken]);
  const [loading, error] = useAPIAction(
    onFetchInvoice,
    requestParams,
    !invoice || !invoice.payout
  );

  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);
  const proposalsTokens = useSelector(sel.apiTokenInventoryResponse);
  const approvedProposalsTokens = useMemo(
    () => proposalsTokens && proposalsTokens.approved,
    [proposalsTokens]
  );

  useEffect(() => {
    !proposalsTokens && onFetchTokenInventory();
  }, [onFetchTokenInventory, proposalsTokens]);

  return { invoice, loading, error, approvedProposalsTokens };
}
