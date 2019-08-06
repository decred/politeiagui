import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import { getCommandsList, getCommandIcon } from "./commands";
import Markdown from "../Markdown";
import styles from "./MarkdownEditor.module.css";
import "./styles.css";
import ReactMde from "react-mde-newest";

const TAB_WRITE = "write";
const TAB_PREVIEW = "preview";

const MarkdownEditor = ({
  onChange,
  value,
  placeholder,
  className,
  filesInput
}) => {
  const [tab, setTab] = useState(TAB_WRITE);

  function handleSwitchTab() {
    const newTab = tab === TAB_WRITE ? TAB_PREVIEW : TAB_WRITE;
    setTab(newTab);
  }

  useEffect(() => {
    const textarea = document.getElementsByClassName("mde-text")[0];
    if (!!textarea) {
      textarea.placeholder = placeholder;
    }
  }, [tab, placeholder]);

  return (
    <div className={classNames(styles.container, className)}>
      <ReactMde
        selectedTab={tab}
        onTabChange={handleSwitchTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(
            <Markdown
              className={classNames(
                styles.previewContainer,
                !markdown && styles.nothingToPreview
              )}
              body={markdown || "Nothing to preview"}
            />
          )
        }
        getIcon={getCommandIcon(filesInput)}
        commands={getCommandsList(!!filesInput)}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

MarkdownEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  fileInput: PropTypes.node
};

MarkdownEditor.defaultProps = {
  placeholder: "Write here"
};

export default MarkdownEditor;
