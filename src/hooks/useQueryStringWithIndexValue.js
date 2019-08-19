import { useEffect, useMemo, useState, useCallback } from "react";
import useQueryString from "./useQueryString";

function useQueryStringWithIndexValue(key, initialIndex, values) {
  values = values.map(v => v.toLowerCase());
  const [value, onSetValue] = useQueryString(key, values[initialIndex]);
  const [index, setIndex] = useState(initialIndex);

  const onSetIndex = useCallback(
    index => {
      const newValue = values[index];
      onSetValue(newValue);
    },
    [values, onSetValue]
  );

  useEffect(
    function onValueChange() {
      const newIndex = values.findIndex(v => v === value);
      setIndex(newIndex >= 0 ? newIndex : initialIndex);
    },
    [value, values, initialIndex]
  );

  return useMemo(() => [index, onSetIndex], [index, onSetIndex]);
}

export default useQueryStringWithIndexValue;
