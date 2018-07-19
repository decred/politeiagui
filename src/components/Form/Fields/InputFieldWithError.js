import React from "react";

const InputFieldWithError = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div className="input-with-error">
    <label>{label}</label>
    <input {...input} placeholder={label} type={type} />
    <div className="input-subline">
      {touched &&
        ((error && <div className="input-error">{error}</div>) ||
          (warning && <div className="input-warning">{warning}</div>))}
    </div>
  </div>
);

export default InputFieldWithError;
