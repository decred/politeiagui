import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import { useSelector } from "react-redux";
import { navigation } from "@politeiagui/core/globalServices";
import isEmpty from "lodash/isEmpty";
import styles from "./styles.module.css";

const backArrow = <>&#8592;</>;

function getPreviousRoute(history, breakpointPathname) {
  if (isEmpty(history)) return;

  let targetRoute;
  for (const route of history) {
    if (route?.href && !route.href.includes(breakpointPathname)) {
      targetRoute = route;
    }
  }
  return targetRoute;
}

export const GoBackLink = ({ className, backFromPathname, ...props }) => {
  const history = useSelector(navigation.selectHistory);
  const route = getPreviousRoute(history, backFromPathname);

  return route ? (
    <a
      href={route.href}
      data-link
      className={classNames(styles.link, className)}
      {...props}
    >
      {backArrow} Go Back
    </a>
  ) : null;
};

GoBackLink.propTypes = {
  backFromPathname: PropTypes.string.isRequired,
};
