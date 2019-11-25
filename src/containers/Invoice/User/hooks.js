import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

export function useUserInvoices() {
  const invoices = useSelector(sel.getCurrentUserInvoices);
  const onFetchUserInvoices = useAction(act.onFetchUserInvoices);

  const [loading, error] = useAPIAction(onFetchUserInvoices);

  useThrowError(error);

  return { loading, invoices };
}
