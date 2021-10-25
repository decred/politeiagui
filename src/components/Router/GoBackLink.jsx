import React from "react";
import PropTypes from "prop-types";
import { Link, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { useRouter } from "src/components/Router";
import styles from "./GoBackLink.module.css";

const backArrow = <>&#8592;</>;

const GoBackLink = ({ defaultLink, label }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const { pastLocations, history } = useRouter();
  const previousLocation = pastLocations[1];

  if (!previousLocation && !defaultLink) return null;
  return (
    <div className={styles.returnLinkContainer}>
      <Link
        className={classNames(
          styles.returnLink,
          isDarkTheme && styles.darkReturnLink
        )}
        onClick={() =>
          !previousLocation && defaultLink
            ? history.push(defaultLink)
            : history.goBack()
        }>
        {backArrow} {label}
      </Link>
    </div>
  );
};

GoBackLink.propTypes = {
  defaultLink: PropTypes.string,
  label: PropTypes.string
};

GoBackLink.defaultProps = {
  label: "Go Back"
};

export default GoBackLink;
