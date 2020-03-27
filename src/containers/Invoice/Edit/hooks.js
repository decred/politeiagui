import * as act from "src/actions";
import { useAction } from "src/redux";

export function useEditInvoice() {
  const onEditInvoice = useAction(act.onEditInvoice);
  return { onEditInvoice };
}
