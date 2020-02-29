import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";

const getKey = (moth, year) => `${year}-${moth}`;

function useExchangeRate(month, year) {
  const exchangeRates = useSelector(sel.exchangeRates);
  const onFetchExchangeRate = useAction(act.onFetchExchangeRate);

  const currRate = exchangeRates[getKey(month, year)];
  const needsFetching = !currRate;

  const params = useMemo(() => [month, year], [month, year]);
  const [loading, error] = useAPIAction(
    onFetchExchangeRate,
    params,
    needsFetching
  );

  return [currRate, loading, error];
}

export default useExchangeRate;
