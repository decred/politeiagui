import {
  classNames,
  useTheme,
  P,
  DEFAULT_DARK_THEME_NAME,
  Spinner
} from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import styles from "./InfoSection.module.css";
import isEmpty from "lodash/isEmpty";

const InfoSection = ({
  label,
  info,
  alignLabelCenter,
  className,
  noMargin,
  error,
  isLoading
}) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <div
      className={classNames(
        styles.sectionWrapper,
        "margin-bottom-s",
        className,
        noMargin && "no-margin-bottom"
      )}
    >
      <span
        className={classNames(styles.label, isDarkTheme && styles.darkLabel)}
        style={alignLabelCenter && { alignSelf: "center" }}
      >
        {label}:
      </span>
      {isLoading ? (
        <Spinner invert />
      ) : error ? (
        <P className={styles.infoError}>{error.toString()}</P>
      ) : !isEmpty(info) ? (
        <span className={styles.info}>{info}</span>
      ) : (
        <span className={styles.noInfo}>No information provided</span>
      )}
    </div>
  );
};

InfoSection.propTypes = {
  label: PropTypes.string,
  info: PropTypes.node,
  className: PropTypes.string,
  noMargin: PropTypes.bool
};

export default InfoSection;
