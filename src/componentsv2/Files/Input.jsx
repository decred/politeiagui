import React from "react";
import ReactFileReader from "react-file-reader";
import { getFormattedFiles, getValidatedFiles } from "./helpers";

const FilesInput = ({ value, onChange, children, policy }) => {
  function handleFilesChange(files) {
    const formattedFiles = getFormattedFiles(files);
    const inputAndNewFiles = !!value
      ? formattedFiles.concat(value)
      : formattedFiles;
    const { 
      validatedFiles, 
      filesLengthLimitError
    } = getValidatedFiles(inputAndNewFiles, policy);

    onChange(validatedFiles, filesLengthLimitError);
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
