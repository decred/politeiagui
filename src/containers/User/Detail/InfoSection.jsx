import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./infosection.module.css";

const InfoSection = ({ label, info }) => {
  return (
    <div className={classNames(styles.sectionWrapper, "margin-top-m")}>
      <span className={styles.label}>{label}</span>
      <span className={styles.info}>{info}</span>
    </div>
  );
};

InfoSection.propTypes = {
  label: PropTypes.string,
  info: PropTypes.node
};

export default InfoSection;
