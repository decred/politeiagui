import React from "react";
import PropTypes from "prop-types";

const FancyRadioButton = ({ options, value, onChange, style = {} }) => {
  const getOptionClass = (idx, opValue) =>
    (idx === 0 ? "first " : "") +
    (idx === options.length - 1 ? "last " : "") +
    (opValue === value ? "selected " : "");

  return (
    <div className="f-radio" style={style}>
      {options.map((op, idx) => (
        <label
          className={getOptionClass(idx, op.value)}
          key={`op-${idx}`}
          onClick={() => onChange(op.value)}
        >
          <span>{op.text}</span>
        </label>
      ))}
    </div>
  );
};

// validateOption make sure every supplied option has the key "value" in it
const validateOption = (
  propValue,
  key,
  componentName,
  location,
  propFullName
) => {
  if (!propValue[key].hasOwnProperty("value")) {
    return new Error(`Invalid prop ${propFullName} passed to ${componentName}`);
  }
};

FancyRadioButton.propTypes = {
  options: PropTypes.arrayOf(validateOption).isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default FancyRadioButton;
