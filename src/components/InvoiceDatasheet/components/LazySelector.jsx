import React, { useState, useCallback, useMemo } from "react";
import { Select } from "pi-ui";

const fetchingOption = {
  isFetchingOption: true,
  label: "Fetch more...",
  value: ""
};

const LazySelector = ({ options, onFetch, needsFetch, onChange, onCommit }) => {
  const [selected, setSelected] = useState();
  const getValueObj = useCallback(
    (value) => options.find((op) => op.value === value),
    [options]
  );

  const handleChange = useCallback(
    ({ isFetchingOption = false, value }) => {
      if (isFetchingOption) {
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
  return <Select options={ops} value={selected} onChange={handleChange} />;
};

export default LazySelector;
