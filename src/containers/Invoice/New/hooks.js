import * as act from "src/actions";
import { useAction } from "src/redux";

export function useNewInvoice() {
  return {
    onSubmitInvoice: useAction(act.onSaveNewInvoice)
  };
}
