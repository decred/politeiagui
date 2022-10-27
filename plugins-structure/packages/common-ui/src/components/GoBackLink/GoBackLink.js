import React from "react";
import { classNames } from "pi-ui";
import { useSelector } from "react-redux";
import { navigation } from "@politeiagui/core/globalServices";
import startsWith from "lodash/startsWith";
import findLast from "lodash/findLast";
import styles from "./styles.module.css";

const backArrow = <>&#8592;</>;

export const GoBackLink = ({ className, ...props }) => {
  const history = useSelector(navigation.selectHistory);

  const parent = findLast(
    history,
    (hs) =>
      startsWith(window.location.pathname, hs.pathname) &&
      hs.pathname !== window.location.pathname
  );

  return parent ? (
    <a
      href={parent.href}
      data-link
      className={classNames(styles.link, className)}
      {...props}
    >
      {backArrow} Go Back
    </a>
  ) : null;
};
