import { useEffect, useMemo, useState } from "react";
import useQueryString from "./useQueryString";

function useQueryStringWithIndexValue(key, initialIndex, values) {
  values = values.map(v => v.toLowerCase());
  const [value, onSetValue] = useQueryString(key, values[initialIndex]);
  const [index, setIndex] = useState(initialIndex);

  function onSetIndex(index) {
    const newValue = values[index];
    onSetValue(newValue);
  }

  useEffect(
    function onValueChange() {
      const newIndex = values.findIndex(v => v === value);
      setIndex(newIndex);
    },
    [value]
  );

  return useMemo(() => [index, onSetIndex], [index]);
}

export default useQueryStringWithIndexValue;
