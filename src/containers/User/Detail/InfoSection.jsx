import { classNames } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import styles from "./infosection.module.css";

const InfoSection = ({ label, info, alignLabelCenter, className, noMargin }) => {
  return (
    <div
      className={classNames(styles.sectionWrapper, "margin-bottom-s", className, noMargin && "no-margin-bottom")}
    >
      <span
        className={styles.label}
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
