import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem } from "pi-ui";
import { useVersionPicker } from "./hooks";

const VersionPicker = ({ version, token, className }) => {
  const { disablePicker, onChangeVersion } = useVersionPicker({
    version,
    token
  });

  const getVersionsOptions = () => {
    const versions = [];
    for (let index = version; index >= 1; index--) {
      versions.push(index);
    }
    return versions;
  };

  return (
    !disablePicker && (
      <Dropdown
        title={`version ${version}`}
        className={className}
        itemsListClassName={className}>
        {getVersionsOptions().map((v) => (
          <DropdownItem
            key={v}
            onClick={() => {
              onChangeVersion(v);
            }}>
            version {v}
          </DropdownItem>
        ))}
      </Dropdown>
    )
  );
};

VersionPicker.propTypes = {
  version: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default VersionPicker;
