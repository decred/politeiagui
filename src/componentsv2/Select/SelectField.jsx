import React from "react";
import Select from "./Select";
import { FormikConsumer } from "formik";

const getSelectValue = (formValue, options) =>
  options.find((op) => op.value === formValue);

const SelectField = ({ name, options, ...props }) => {
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
            {...props}></Select>
        );
      }}
    </FormikConsumer>
  );
};

export default SelectField;
