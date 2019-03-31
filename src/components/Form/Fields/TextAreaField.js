import React from "react";

const TextAreaField = ({
  input,
  label,
  placeholder,
  tabIndex,
  type,
  meta: { touched, error, warning }
}) => (
  <div className="input-with-error">
    <label>{label}</label>
    <textarea
      {...input}
      tabIndex={tabIndex}
      placeholder={placeholder}
      type={type}
    />
    <div className="input-subline">
      {touched &&
        ((error && <div className="input-error">{error}</div>) ||
          (warning && <div className="input-warning">{warning}</div>))}
    </div>
  </div>
);

export default TextAreaField;
