import React from "react";
import PropTypes from "prop-types";
import { Text, classNames } from "pi-ui";
import styles from "./Invoice.module.css";

const Field = ({ label, value, renderValue }) => {
  return (
    <div className={styles.field}>
      <Text className={styles.fieldLabel}>{label}</Text>
      {renderValue ? (
        renderValue(value)
      ) : (
        <Text
          size="large"
          className={classNames("margin-top-xs margin-bottom-xs")}
        >
          {value}
        </Text>
      )}
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  renderValue: PropTypes.func
};

export default Field;
