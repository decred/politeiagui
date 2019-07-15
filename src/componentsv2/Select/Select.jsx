import React from "react";
import ReactSelect, { components } from "react-select";
import { classNames } from "pi-ui";
import "./styles.css";

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <div
          className={classNames(
            "arrowAnchor",
            props.selectProps.menuIsOpen && "open"
          )}
        />
      </components.DropdownIndicator>
    )
  );
};

const Select = props => {
  return (
    <ReactSelect
      classNamePrefix="customSelect"
      components={{ DropdownIndicator }}
      {...props}
    />
  );
};

export default Select;
