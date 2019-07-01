import { classNames } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import styles from "./infosection.module.css";

const InfoSection = ({ label, info, alignLabelCenter }) => {
  return (
    <div className={classNames(styles.sectionWrapper, "margin-top-m")}>
      <span className={styles.label} style={alignLabelCenter && { alignSelf: "center" }}>{label}</span>
      <span className={styles.info}>{info}</span>
    </div>
  );
};

InfoSection.propTypes = {
  label: PropTypes.string,
  info: PropTypes.node
};

export default InfoSection;
