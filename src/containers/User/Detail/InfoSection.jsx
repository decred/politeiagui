import { classNames, useTheme } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import styles from "./InfoSection.module.css";

const InfoSection = ({ label, info, alignLabelCenter, className, noMargin }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  return (
    <div
      className={classNames(styles.sectionWrapper, "margin-bottom-s", className, noMargin && "no-margin-bottom")}
    >
      <span
        className={classNames(styles.label, isDarkTheme && styles.darkLabel)}
        style={alignLabelCenter && { alignSelf: "center" }}
      >
        {label}
      </span>
      <span className={styles.info}>{info}</span>
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
