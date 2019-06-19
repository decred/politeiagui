import React from "react";

const SelectField = ({
  input,
  label,
  tabIndex,
  options,
  meta: { touched, error, warning },
  disabled
}) => (
  <div className="input-with-error">
    <label>{label}</label>
    <select {...input} tabIndex={tabIndex} disabled={disabled}>
      {options.map((op, idx) => (
        <option key={`option-${idx}`}>{op}</option>
      ))}
    </select>
    <div className="input-subline">
      {touched &&
        ((error && <div className="input-error">{error}</div>) ||
          (warning && <div className="input-warning">{warning}</div>))}
    </div>
  </div>
);

export default SelectField;
