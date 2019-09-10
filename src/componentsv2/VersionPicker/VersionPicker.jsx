import React from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem } from "pi-ui";
import ModalDiff from "src/componentsv2/ModalDiff";
import { useVersionPicker } from "./hooks";

const VersionPicker = ({ version, token, className }) => {
  const {
    disablePicker,
    onChangeVersion,
    showModal,
    onToggleModal,
    proposalDiff
  } = useVersionPicker({ version, token });

  const getVersionsOptions = () => {
    const versions = [];
    for (let index = version; index >= 1; index--) {
      versions.push(index);
    }
    return versions;
  };

  return !disablePicker && (
    <>
      <Dropdown title={`version ${version}`} className={className} itemsListClassName={className}>
        {getVersionsOptions().map(v => (
          <DropdownItem key={v} onClick={() => { onChangeVersion(v); }}>
            version {v}
          </DropdownItem>
        ))}
      </Dropdown>
      { proposalDiff && (
        <ModalDiff
          onClose={onToggleModal}
          show={showModal}
          proposalDetails={proposalDiff.details}
          oldText={proposalDiff.oldText}
          oldFiles={proposalDiff.oldFiles}
          newText={proposalDiff.newText}
          newFiles={proposalDiff.newFiles}

        />
      )}
    </>
  );
};

VersionPicker.propTypes = {
  version: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default VersionPicker;
