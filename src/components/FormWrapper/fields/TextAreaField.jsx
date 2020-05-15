import React from "react";
import { TextArea, classNames } from "pi-ui";
import { useField } from "formik";
import PropTypes from "prop-types";
import styles from "../FormWrapper.module.css";

const TextAreaField = ({ name, placeholder, id, className }) => {
  const [field, meta, helpers] = useField(name);
  const { onChange } = field;
  const { error, value } = meta;
  const { setTouched } = helpers;

  const handleChange = (e) => {
    setTouched(true);
    onChange(e);
  };
  return (
    <TextArea
      inputClassNames={classNames(error && styles.inputError, className)}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      wrapperClassNames="no-margin-top"
      error={error}
      id={id}
    />
  );
};

TextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

TextAreaField.defaultProps = {
  placeholder: ""
};

export default TextAreaField;
