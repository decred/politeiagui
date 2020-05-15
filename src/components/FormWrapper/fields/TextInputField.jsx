import React from "react";
import { useField } from "formik";
import { BoxTextInput, classNames } from "pi-ui";
import PropTypes from "prop-types";

const TextInput = ({ name, placeholder, className }) => {
  const [field, meta, helpers] = useField(name);
  const { onChange, value } = field;
  const { error, touched } = meta;
  const { setTouched } = helpers;

  const handleChangeWithTouched = (e) => {
    setTouched(true);
    onChange(e);
  };

  return (
    <BoxTextInput
      placeholder={placeholder}
      name={name}
      tabIndex={1}
      value={value}
      className={classNames(className, "full-width")}
      onChange={handleChangeWithTouched}
      error={touched && !(error instanceof Object) ? error : ""}
    />
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

export default TextInput;
