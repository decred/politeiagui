import React from "react";
import ReactFileReader from "react-file-reader";
import { getFormattedFiles } from "./helpers";

const FilesInput = ({ value, onChange, children, disabled }) => {
  function handleFilesChange(files) {
    const formattedFiles = getFormattedFiles(files);
    const inputAndNewFiles = !!value
      ? formattedFiles.concat(value)
      : formattedFiles;

    onChange(inputAndNewFiles);
  }

  return (
    <ReactFileReader
      base64
      multipleFiles
      handleFiles={handleFilesChange}
      disabled={disabled}
    >
      {children}
    </ReactFileReader>
  );
};

export default FilesInput;
