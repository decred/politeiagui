import { useState } from "react";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";

function useQueryString(key, initialValue) {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  function onSetValue(newValue) {
    setValue(newValue);
    setQueryStringValue(key, newValue);
  }

  return [value, onSetValue];
}

export default useQueryString;
