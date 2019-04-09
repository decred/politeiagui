import React from "react";
import PropTypes from "prop-types";

const DescriptiveField = ({ label, children }) => (
  <div className="field">
    <label className="field-label">{label && label + ":"}</label>
    <div className="field-value">{children}</div>
    <div className="clear" />
  </div>
);

DescriptiveField.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default DescriptiveField;
