import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./styles.module.css";

export function LabelValueList({ items, alignValues, ...props }) {
  return (
    <div className={styles.wrapper} {...props}>
      {items.map(({ label, value }, i) => (
        <div
          className={classNames(styles.item, alignValues && styles.align)}
          key={i}
        >
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
      value: PropTypes.node.isRequired,
    })
  ).isRequired,
  alignValues: PropTypes.bool,
};
