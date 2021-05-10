import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";

export function useDcc(dccToken) {
  const dccSelector = useMemo(
    () => sel.makeGetDccByToken(dccToken),
    [dccToken]
  );
  const dcc = useSelector(dccSelector);
  const onFetchDcc = useAction(act.onFetchDcc);

  const requestParams = useMemo(() => [dccToken], [dccToken]);
  const [loading, error] = useAPIAction(onFetchDcc, requestParams, !dcc);

  return { dcc, loading, error };
}
