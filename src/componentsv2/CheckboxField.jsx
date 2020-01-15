import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "pi-ui";
import get from "lodash/get";
import { FormikConsumer, Field } from "formik";

const CheckboxField = ({ name, label }) => {
  return (
    <FormikConsumer>
      {({ values, setFieldValue }) => {
        const handleCheckboxChange = event => {
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
      }}
    </FormikConsumer>
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string
};

export default CheckboxField;
