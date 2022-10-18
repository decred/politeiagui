import React from "react";
import { useSelector } from "react-redux";
import { navigation } from "../../services";
import startsWith from "lodash/startsWith";

const backArrow = <>&#8592;</>;

export const GoBackLink = () => {
  const history = useSelector(navigation.selectHistory);

  const parent = history.find(
    (hs) =>
      startsWith(window.location.pathname, hs.match) &&
      hs.match !== window.location.pathname
  );

  return parent ? (
    <a href={parent.href} data-link>
      {backArrow} Go Back
    </a>
  ) : null;
};
