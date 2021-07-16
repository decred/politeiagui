import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useFetchOnce from "src/hooks/utils/useFetchOnce";

export function useDcc(dccToken) {
  const dccSelector = useMemo(
    () => sel.makeGetDccByToken(dccToken),
    [dccToken]
  );
  const dcc = useSelector(dccSelector);
  const onFetchDcc = useAction(act.onFetchDcc);

  const [loading, error] = useFetchOnce(onFetchDcc, [dccToken], !dcc);

  return { dcc, loading, error };
}
