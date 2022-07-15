import React from "react";
import PropTypes from "prop-types";
import { Select } from "pi-ui";
import { FormikConsumer } from "formik";

const getSelectValue = (formValue, options) =>
  options.find((op) => op.value === formValue);

const SelectField = ({ name, options, disabled, ...props }) => {
  return (
    <FormikConsumer>
      {({ values, setFieldValue }) => {
        const onSelectChange = ({ value }) => {
          setFieldValue(name, value);
        };
        return (
          <Select
            value={getSelectValue(values[name], options)}
            onChange={onSelectChange}
            options={options}
            isDisabled={disabled}
            {...props}
          ></Select>
        );
      }}
    </FormikConsumer>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number
    })
  ).isRequired
};

export default SelectField;
