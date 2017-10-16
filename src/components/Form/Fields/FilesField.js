import React from "react";
import ReactFileReader from "react-file-reader";
import ProposalImages from "../../ProposalImages";

const FilesField = ({ placeholder="Upload", input, touched, error, disabled }) => (
  <div className="files-field">
    <ReactFileReader base64 multipleFiles
      handleFiles={({ base64, fileList }) =>
        input.onChange(Array.from(fileList).map(({ name, size, type: mime }, idx) => ({
          name, mime, size, payload: base64[idx].split("base64,").pop()
        })))
      }
    ><span>{placeholder}</span></ReactFileReader>
    {touched && error && !disabled && <span className="error">{error}</span>}
    <ProposalImages files={input.value || []} />
  </div>
);

export default FilesField;
