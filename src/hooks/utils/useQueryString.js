import { useState, useCallback } from "react";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";

function useQueryString(key, initialValue) {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  const onSetValue = useCallback(
    (newValue) => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [key]
  );

  return [value, onSetValue];
}

export default useQueryString;
