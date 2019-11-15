import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

import useAPIAction from "src/hooks/utils/useAPIAction";

const mapDispatchToProps = {
  onFetchInvoice: act.onFetchInvoice
};

export function useInvoice(invoiceToken) {
  const mapStateToProps = useMemo(
    () => ({
      invoice: sel.makeGetInvoiceByToken(invoiceToken)
    }),
    [invoiceToken]
  );
  const { invoice, onFetchInvoice } = useRedux(
    {},
    mapStateToProps,
    mapDispatchToProps
  );

  const requestParams = useMemo(() => [invoiceToken], [invoiceToken]);
  const [loading, error] = useAPIAction(
    onFetchInvoice,
    requestParams,
    !invoice
  );

  return { invoice, loading, error };
}
