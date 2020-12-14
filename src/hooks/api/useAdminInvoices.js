import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

export default function useAdminInvoices() {
  const invoices = useSelector(sel.allInvoices);
  const onFetchAdminInvoices = useAction(act.onFetchAdminInvoices);

  const [loading, error] = useAPIAction(onFetchAdminInvoices);

  useThrowError(error);

  return { loading, invoices };
}
