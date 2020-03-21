import React from "react";
import PropTypes from "prop-types";
import { Text } from "pi-ui";
import styles from "./DCC.module.css";

const Field = ({ label, value, renderValue }) => {
  return (
    <div className={styles.field}>
      <Text size="small">{label}</Text>
      {renderValue ? (
        renderValue(value)
      ) : (
        <Text size="large">
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
