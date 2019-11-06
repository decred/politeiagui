import { useEffect, useState, useMemo } from "react";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";

const mapStateToProps = {};

const mapDispatchToProps = {
  onFetchExchangeRate: act.onFetchExchangeRate
};

const getKey = (moth, year) => `${year}-${moth}`;

function useExchangeRate(month, year) {
  const [rates, setRates] = useState({});
  const { onFetchExchangeRate } = useRedux(
    {},
    mapStateToProps,
    mapDispatchToProps
  );

  const currRate = rates[getKey(month, year)];
  const needsFetching = !currRate;

  const params = useMemo(() => [month, year], [month, year]);
  const [loading, error, response] = useAPIAction(
    onFetchExchangeRate,
    params,
    needsFetching
  );

  const resRate = response && response.exchangerate;

  useEffect(() => {
    const key = getKey(month, year);
    if (resRate && !rates[key]) {
      setRates({
        ...rates,
        [key]: resRate
      });
    }
  }, [resRate, month, year, setRates, rates]);

  return [currRate, loading, error];
}

export default useExchangeRate;
