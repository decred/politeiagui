import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { toolbarCommands, getCommandIcon } from "./commands";
import Markdown from "../Markdown";
import styles from "./MarkdownEditor.module.css";
import "./styles.css";
import ReactMde, { getDefaultCommandMap } from "react-mde";
import customSaveImageCommand from "./customSaveImageCommand";
import { useCustomImageCommand } from "./CustomImageCommand";
import { getFormattedFile, displayBlobSolution } from "./helpers";

const MarkdownEditor = React.memo(function MarkdownEditor({
  onChange,
  value,
  placeholder,
  className,
  textAreaProps,
  filesInput,
  mapBlobToFile,
  allowImgs,
  disallowedElements,
  ...props
}) {
  const [tab, setTab] = useState("write");
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const testId = props["data-testid"];

  useEffect(() => {
    const textarea = document.getElementsByClassName("mde-text")[0];
    if (textarea) {
      textarea.placeholder = placeholder;
      textarea["data-testid"] = testId;
    }
  }, [tab, placeholder, testId]);

  const saveImage = function ({ serverImage, displayImage }) {
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

  const { imageCommand } = useCustomImageCommand(saveImage);

  const attachFilesCommand = {
    name: "attach-files",
    icon: () => filesInput,
    execute: () => null
  };

  const generateMarkdownPreview = (allowImgs) => (markdown) =>
    Promise.resolve(
      <Markdown
        renderImages={allowImgs}
        className={classNames(
          styles.previewContainer,
          !markdown && styles.nothingToPreview,
          isDarkTheme && !markdown && styles.darkNothingToPreview,
          isDarkTheme && "dark"
        )}
        body={markdown || "Nothing to preview"}
        disallowedElements={disallowedElements}
      />
    );

  return (
    <div className={classNames(styles.container, className)}>
      <ReactMde
        selectedTab={tab}
        onTabChange={setTab}
        textAreaProps={textAreaProps}
        generateMarkdownPreview={generateMarkdownPreview(allowImgs)}
        getIcon={getCommandIcon}
        commands={{
          ...getDefaultCommandMap(),
          "attach-files": attachFilesCommand,
          image: imageCommand,
          "save-image": customSaveImageCommand
        }}
        toolbarCommands={toolbarCommands(allowImgs)}
        onChange={onChange}
        value={value}
        paste={
          allowImgs
            ? {
                saveImage: saveImage
              }
            : null
        }
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
