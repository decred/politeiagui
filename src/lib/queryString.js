import qs from "query-string";

export const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qsValue;
  window.history.replaceState({ path: newurl, search: qsValue }, "", newurl);
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
  window.history.replaceState({ path: newurl }, "", newurl);
};
