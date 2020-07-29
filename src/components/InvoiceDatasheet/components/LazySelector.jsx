import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Select, Spinner } from "pi-ui";

const fetchingOption = {
  isFetchingOption: true,
  label: "Fetch more...",
  value: ""
};

const LazySelector = ({
  options,
  onFetch,
  needsFetch,
  onChange,
  onCommit,
  error = null
}) => {
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(false);
  const getValueObj = useCallback(
    (value) => options.find((op) => op.value === value),
    [options]
  );

  const handleChange = useCallback(
    ({ isFetchingOption = false, value }) => {
      if (isFetchingOption) {
        setLoading(true);
        onFetch();
      } else {
        setSelected(getValueObj(value));
        onChange(value);
        onCommit(value);
      }
    },
    [onFetch, setSelected, onChange, onCommit, getValueObj]
  );

  const ops = useMemo(
    () => (needsFetch ? [...options, fetchingOption] : options),
    [options, needsFetch]
  );

  useEffect(
    function onOptionsChangeOrError() {
      return () => {
        setLoading(false);
      };
    },
    [options, error]
  );

  console.log("loading");
  return loading ? (
    <div className="margin-top-s">
      <Spinner invert />
    </div>
  ) : (
    <Select options={ops} value={selected} onChange={handleChange} />
  );
};

export default LazySelector;
