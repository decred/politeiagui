import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import { getCommandsList, getCommandIcon } from "./commands";
import Markdown from "../Markdown";
import styles from "./MarkdownEditor.module.css";
import "./styles.css";
import ReactMde from "react-mde-newest";

const MarkdownEditor = React.memo(function MarkdownEditor({
  onChange,
  value,
  placeholder,
  className,
  filesInput,
  textAreaProps
}) {
  const [tab, setTab] = useState("write");

  useEffect(() => {
    const textarea = document.getElementsByClassName("mde-text")[0];
    if (textarea) {
      textarea.placeholder = placeholder;
    }
  }, [tab, placeholder]);

  const generateMarkdownPreview = useCallback(
    markdown =>
      Promise.resolve(
        <Markdown
          className={classNames(
            styles.previewContainer,
            !markdown && styles.nothingToPreview
          )}
          body={markdown || "Nothing to preview"}
        />
      ),
    []
  );

  const getIcon = useMemo(() => getCommandIcon(filesInput), [filesInput]);

  const hasFileInput = !!filesInput;
  const commandList = useMemo(() => getCommandsList(hasFileInput), [
    hasFileInput
  ]);

  return (
    <div className={classNames(styles.container, className)}>
      <ReactMde
        selectedTab={tab}
        onTabChange={setTab}
        textAreaProps={textAreaProps}
        generateMarkdownPreview={generateMarkdownPreview}
        getIcon={getIcon}
        commands={commandList}
        onChange={onChange}
        value={value}
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
