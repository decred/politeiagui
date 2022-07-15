import React from "react";
import FileReaderInput from "react-file-reader-input";
import { getFormattedFiles } from "./helpers";

const FilesInput = ({ onChange, children, acceptedFiles }) => {
  function handleFilesChange(e, files) {
    const formattedFiles = getFormattedFiles(files);
    onChange(formattedFiles, files);
  }

  return (
    <FileReaderInput
      as="binary"
      id="my-file-input"
      accept={acceptedFiles || "*"}
      onChange={handleFilesChange}
      multiple
    >
      {children}
    </FileReaderInput>
  );
};

export default FilesInput;
