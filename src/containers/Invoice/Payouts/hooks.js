import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

export function useAdminPayouts() {
  const payouts = useSelector(sel.payouts);
  const onGeneratePayouts = useAction(act.onGeneratePayouts);

  const [loading, error] = useAPIAction(onGeneratePayouts);

  useThrowError(error);

  return { loading, payouts };
}
