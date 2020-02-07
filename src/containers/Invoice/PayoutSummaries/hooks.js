import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";

export function useInvoicePayouts() {
  const lineItemPayouts = useSelector(sel.lineItemPayouts);
  const loading = useSelector(sel.isApiRequestingInvoicePayouts);
  const onInvoicePayouts = useAction(act.onInvoicePayouts);

  return { loading, lineItemPayouts, onInvoicePayouts };
}
