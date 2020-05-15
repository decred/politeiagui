import React, { useMemo } from "react";
import { classNames, Select } from "pi-ui";
import { useField } from "formik";
import PropTypes from "prop-types";
import styles from "../FormWrapper.module.css";

const SelectField = ({ name, options, isDisabled, onChange, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { value } = field;
  const { error, touched } = meta;
  const { setValue, setTouched } = helpers;

  const selectValue = useMemo(() => options.find((op) => op.value === value), [
    options,
    value
  ]);

  const onSelectChange = (e) => {
    setValue(e.value);
    setTouched(true);
    onChange && onChange(e);
  };

  return (
    <div
      className={classNames(
        styles.formSelect,
        error && styles.formSelectError
      )}>
      <Select
        value={selectValue}
        onChange={onSelectChange}
        options={options}
        error={touched && error}
        isDisabled={isDisabled}
        className={classNames(styles.selectWrapper, props.className)}
      />
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func
};

SelectField.defaultProps = {
  isDisabled: false
};

export default SelectField;
