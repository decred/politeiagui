import React from "react";
import ReactFileReader from "react-file-reader";
import { getFormattedFiles } from "./helpers";

const FilesInput = ({ value, onChange, children }) => {
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
    >
      {children}
    </ReactFileReader>
  );
};

export default FilesInput;
