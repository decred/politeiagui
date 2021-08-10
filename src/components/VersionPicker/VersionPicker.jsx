import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem, Spinner } from "pi-ui";
import { useVersionPicker } from "./hooks";

const VersionPicker = ({ version, token, className, proposalState }) => {
  const { disablePicker, onChangeVersion, isLoading } = useVersionPicker(
    version,
    token,
    proposalState
  );

  const versionsOptions = useMemo(() => {
    const versions = [];
    for (let index = version; index >= 1; index--) {
      versions.push(index);
    }
    return versions;
  }, [version]);

  return (
    !disablePicker &&
    (!isLoading ? (
      <Dropdown
        title={`version ${version}`}
        className={className}
        itemsListClassName={className}>
        {versionsOptions.map((v) => (
          <DropdownItem
            key={v}
            onClick={() => {
              onChangeVersion(v, version);
            }}>
            version {v}
          </DropdownItem>
        ))}
      </Dropdown>
    ) : (
      <div style={{ padding: "2px" }}>
        <Spinner invert />
      </div>
    ))
  );
};

VersionPicker.propTypes = {
  version: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default VersionPicker;
