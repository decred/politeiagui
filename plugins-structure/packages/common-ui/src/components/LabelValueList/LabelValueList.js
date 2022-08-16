import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.css";

export function LabelValueList({ items, ...props }) {
  return (
    <div className={styles.wrapper} {...props}>
      {items.map(({ label, value }, i) => (
        <div className={styles.item} key={i}>
          <div className={styles.label}>{label}:</div>
          <div className={styles.value}>{value}</div>
        </div>
      ))}
    </div>
  );
}

LabelValueList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};
