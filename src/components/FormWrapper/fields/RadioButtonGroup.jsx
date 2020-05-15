import React from "react";
import { useField } from "formik";
import { RadioButtonGroup as RadioButtonGroupUI } from "pi-ui";
import styles from "../FormWrapper.module.css";
import PropTypes from "prop-types";

const RadioButtonGroup = ({ name, label, options, onChange }) => {
  const [, meta, helpers] = useField(name);
  const { value, error } = meta;
  const { setValue } = helpers;

  const handleChangeDccType = (e) => {
    setValue(e.value);
    onChange(e);
  };

  return (
    <RadioButtonGroupUI
      label={label}
      name={name}
      options={options}
      value={value}
      error={error}
      onChange={handleChangeDccType}
      className={styles.radioButton}
    />
  );
};

RadioButtonGroup.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number
    })
  ).isRequired,
  onChange: PropTypes.func
};

RadioButtonGroup.defaultProps = {
  onChange: () => {}
};

export default RadioButtonGroup;
