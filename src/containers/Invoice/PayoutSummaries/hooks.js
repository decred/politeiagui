import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useThrowError from "src/hooks/utils/useThrowError";

export function useInvoicePayouts() {
  const lineItemPayouts = useSelector(sel.lineItemPayouts);
  const loading = useSelector(sel.isApiRequestingInvoicePayouts);
  const error = useSelector(sel.invoicePayoutsError);
  const onInvoicePayouts = useAction(act.onInvoicePayouts);

  useThrowError(error);

  return { loading, lineItemPayouts, onInvoicePayouts };
}
