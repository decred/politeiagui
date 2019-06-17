import { useState, useEffect, useMemo } from "react";
import qs from "query-string";

export const setQueryStringWithoutPageReload = qsValue => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qsValue;
  window.history.pushState({ path: newurl }, "", newurl);
};

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  return values[key];
};

export const getQueryStringValues = (queryString = window.location.search) =>
  qs.parse(queryString);

export const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({
    ...values,
    [key]: value
  });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export const removeQueryStringsFromUrl = (url, parameter, parameter2) => {
  const newurl = url
    .replace(new RegExp("[?&]" + parameter + "=[^&#]*(#.*)?$"), "$1")
    .replace(new RegExp("([?&])" + parameter + "=[^&]*&"), "$1")
    .replace(new RegExp("[?&]" + parameter2 + "=[^&#]*(#.*)?$"), "$1")
    .replace(new RegExp("([?&])" + parameter2 + "=[^&]*&"), "$1");
  window.history.pushState({ path: newurl }, "", newurl);
};

export function useQueryString(key, initialValue) {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  function onSetValue(newValue) {
    setValue(newValue);
    setQueryStringValue(key, newValue);
  }

  return [value, onSetValue];
}

export function useQueryStringWithIndexValue(key, initialIndex, values) {
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
