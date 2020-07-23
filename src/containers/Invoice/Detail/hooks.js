import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useUserDetail from "src/hooks/api/useUserDetail";
import { isUserDeveloper } from "src/containers/DCC/helpers";

export function useInvoice(invoiceToken) {
  const invoiceSelector = useMemo(
    () => sel.makeGetInvoiceByToken(invoiceToken),
    [invoiceToken]
  );
  const invoice = useSelector(invoiceSelector);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const onFetchInvoice = useAction(act.onFetchInvoice);
  const requestParams = useMemo(() => [invoiceToken], [invoiceToken]);
  const [loading, error] = useAPIAction(
    onFetchInvoice,
    requestParams,
    !invoice || !invoice.payout
  );

  return { invoice, isAdmin, loading, error };
}

export function useInvoicesSummary(currentInvoice, userid, start, end) {
  const onFetchAdminInvoicesWithoutState = useAction(
    act.onFetchAdminInvoicesWithoutState
  );

  const { user } = useUserDetail(userid);
  console.log(user);

  const [
    loading,
    error,
    invoices
  ] = useAPIAction(onFetchAdminInvoicesWithoutState, [start, end, userid]);

  return {
    loading,
    error,
    // return if the user is developer
    isUserDeveloper: isUserDeveloper(user),
    // return invoices array but filter the current invoice out
    invoices: invoices
      ? invoices.filter((inv) => inv.censorshiprecord.token !== currentInvoice)
      : null
  };
}

export function useCodeStats(userid, start, end) {
  const codeStatsSelector = useMemo(
    () => sel.makeGetCodeStatsByUserID(userid),
    [userid]
  );
  const codestats = useSelector(codeStatsSelector);

  const onFetchUserCodeStats = useAction(act.onFetchUserCodeStats);

  const [loading, error] = useAPIAction(onFetchUserCodeStats, [
    userid,
    start,
    end
  ]);

  return {
    loading,
    error,
    codestats
  };
}
