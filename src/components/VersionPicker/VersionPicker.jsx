import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem } from "pi-ui";
import { useVersionPicker } from "./hooks";

const VersionPicker = ({ version, token, className, proposalState }) => {
  const { disablePicker, onChangeVersion } = useVersionPicker(
    version,
    token,
    proposalState
  );

  const versionsOptions = useMemo(() => {
    const versions = [];
    for (let index = parseInt(version); index >= 1; index--) {
      versions.push(index);
    }
    return versions;
  }, [version]);

  return (
    !disablePicker && (
      <Dropdown
        title={`version ${version}`}
        className={className}
        itemsListClassName={className}>
        {versionsOptions.map((v) => (
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
