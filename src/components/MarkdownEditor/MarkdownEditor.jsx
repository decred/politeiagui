import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { classNames, useTheme } from "pi-ui";
import { toolbarCommands, getCommandIcon  } from "./commands";
import Markdown from "../Markdown";
import styles from "./MarkdownEditor.module.css";
import "./styles.css";
import { digestPayload } from "src/helpers";
import ReactMde, { getDefaultCommandMap } from "react-mde";
import customSaveImageCommand from "./customSaveImageCommand";

/** displayBlobSolution receives a pair of [ArrayBuffer, File] and returns a blob URL to display the image on preview */
const displayBlobSolution = (f) => {
  const [result] = f;
  const bytes = new Uint8Array(result);
  const blob = new Blob([bytes], { type: "image/png" });
  const urlCreator = window.URL || window.webkitURL;
  const imageUrl = urlCreator.createObjectURL(blob);
  return imageUrl;
};

/** getFormattedFile receives a pair of [ArrayBuffer, File] and returns an object in the exact format we need to submit to the backend */
function getFormattedFile(f) {
  const [result, file] = f;
  const payload = btoa(result);
  return ({
      name: file.name,
      mime: file.type,
      size: file.size,
      payload,
      digest: digestPayload(payload)
    })
  ;
}

const MarkdownEditor = React.memo(function MarkdownEditor({
  onChange,
  value,
  placeholder,
  className,
  textAreaProps,
  filesInput,
  mapBlobToFile
}) {
  const [tab, setTab] = useState("write");
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";

  useEffect(() => {
    const textarea = document.getElementsByClassName("mde-text")[0];
    if (textarea) {
      textarea.placeholder = placeholder;
    }
  }, [tab, placeholder]);

  const attachFilesCommand = {
    name: "attach-files",
    icon: () => filesInput,
    execute: () => null
  };

  const generateMarkdownPreview = useCallback(
    (markdown) =>
      Promise.resolve(
        <Markdown
          className={classNames(
            styles.previewContainer,
            !markdown && styles.nothingToPreview,
            isDarkTheme && !markdown && styles.darkNothingToPreview,
            isDarkTheme && "dark"
          )}
          body={markdown || "Nothing to preview"}
        />
      ),
    [isDarkTheme]
  );

  const save = function ({ serverImage, displayImage }) {
    try {
      const fileToUpload = getFormattedFile(serverImage);
      const urlToDisplay = displayBlobSolution(displayImage);
      mapBlobToFile.set(urlToDisplay, fileToUpload);
      return {
        name: fileToUpload.name,
        url: urlToDisplay
      };
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      <ReactMde
        selectedTab={tab}
        onTabChange={setTab}
        textAreaProps={textAreaProps}
        generateMarkdownPreview={generateMarkdownPreview}
        getIcon={getCommandIcon}
        commands={{
          ...getDefaultCommandMap(),
          "attach-files": attachFilesCommand,
          "save-image": customSaveImageCommand
        }}
        toolbarCommands={toolbarCommands}
        onChange={onChange}
        value={value}
        paste={{
          saveImage: save
        }}
      />
    </div>
  );
});

MarkdownEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  fileInput: PropTypes.node,
  textAreaProps: PropTypes.object
};

MarkdownEditor.defaultProps = {
  placeholder: "Write here",
  textAreaProps: {}
};

export default MarkdownEditor;
