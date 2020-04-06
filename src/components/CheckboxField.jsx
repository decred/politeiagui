import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "pi-ui";
import get from "lodash/get";
import { useFormikContext, Field } from "formik";

const CheckboxField = ({ name, label }) => {
  const { values, setFieldValue } = useFormikContext();
  const handleCheckboxChange = (event) => {
    setFieldValue(name, event.target.checked);
  };
  return (
    <Field
      component={Checkbox}
      checked={get(values, name)}
      onChange={handleCheckboxChange}
      id={`check-${name}`}
      name={name}
      label={label}
    />
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string
};

export default CheckboxField;
