import React from "react";
import ReactFileReader from "react-file-reader";
import { getFormattedFiles } from "./helpers";

const FilesInput = ({ value, onChange, children, validMimeTypes }) => {
  function handleFilesChange(files) {
    const formattedFiles = getFormattedFiles(files);
    const inputAndNewFiles = !!value
      ? formattedFiles.concat(value)
      : formattedFiles;
    // const validation = validateFiles(inputAndNewFiles, policy);

    // this.setState({
    //     policyErrors: validation.errors ? validation.errors : []
    // });

    onChange(inputAndNewFiles);
  }

  return (
    <ReactFileReader
      base64
      multipleFiles
      fileTypes={validMimeTypes}
      handleFiles={handleFilesChange}
    >
      {children}
    </ReactFileReader>
  );
};

export default FilesInput;
