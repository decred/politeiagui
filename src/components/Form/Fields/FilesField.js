import React from "react";
import PropTypes from "prop-types";
import ReactFileReader from "react-file-reader";
import ProposalImages from "../../ProposalImages";

const FilesField = ({ placeholder="Upload", input, touched, error, disabled, policy }) => (
  <div className="files-field">
    <ReactFileReader
      base64
      multipleFiles
      handleFiles={({ base64, fileList }) =>
        input.onChange(Array.from(fileList).map(({ name, size, type: mime }, idx) => ({
          name, mime, size, payload: base64[idx].split("base64,").pop()
        })))
      }
    ><button>{placeholder}</button></ReactFileReader>
    {touched && error && !disabled && <span className="error">{error}</span>}
    <ProposalImages files={input.value || []} onChange={input.onChange} policy={policy} />
  </div>
);

FilesField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  policy: PropTypes.object.isRequired,
};

export default FilesField;
