import React from "react";
import Dropdown from "./Dropdown";
import PropTypes from "prop-types";

const dropdownContentStyle = {
  display: "flex",
  flexDirection: "column",
  top: "20px",
  background: "white",
  zIndex: "99",
  width: "100px",
  fontSize: "14px",
  boxShadow: "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
};

const dropdownTriggerStyle = {
  fontSize: "14px",
  display: "flex",
  alignItems: "center"
};

const dropdownItemStyle = {
  cursor: "pointer",
  textAlign: "center"
};

const VersionPicker = ({ version, onSelectVersion }) => {
  const versionsOptions = [];
  const disablePicker = version === "1";

  for (let i = parseInt(version, 10); i >= 1; i--) {
    versionsOptions.push(
      <span
        key={i}
        className="version-picker__item"
        style={dropdownItemStyle}
        onClick={() => onSelectVersion(i.toString())}
      >{`version ${i}`}</span>
    );
  }
  return (
    <Dropdown
      dropdownContentStyle={dropdownContentStyle}
      dropdownTriggerStyle={dropdownTriggerStyle}
      DropdownTrigger={<span>edited</span>}
      DropdownContent={<div>{versionsOptions}</div>}
      hideDropdownIcon={disablePicker}
      disabled={disablePicker}
    />
  );
};

VersionPicker.propTypes = {
  version: PropTypes.string.isRequired,
  onSelectVersion: PropTypes.func.isRequired
};

export default VersionPicker;
