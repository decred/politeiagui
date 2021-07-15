import { useEffect, useMemo, useState, useCallback } from "react";
import useQueryString from "./useQueryString";

const findIndexValue = (value, values, initialIndex = 0) => {
  const index = values.findIndex((v) => v === value);
  return index >= 0 ? index : initialIndex;
};

function useQueryStringWithIndexValue(key, initialIndex, values) {
  const computedValues = useMemo(
    () => values.map((v) => v.toLowerCase()),
    [values]
  );
  const [value, onSetValue] = useQueryString(key, values[initialIndex]);
  const [index, setIndex] = useState(
    findIndexValue(value, computedValues, initialIndex)
  );

  const onSetIndex = useCallback(
    (index) => {
      const newValue = computedValues[index];
      onSetValue(newValue);
    },
    [computedValues, onSetValue]
  );

  useEffect(
    function onValueChange() {
      setIndex(findIndexValue(value, computedValues, initialIndex));
    },
    [value, computedValues, initialIndex]
  );

  return [index, onSetIndex];
}

export default useQueryStringWithIndexValue;
