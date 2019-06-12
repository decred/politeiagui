import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, classNames } from "pi-ui";
import commands from "./commands";
import Markdown from "../Markdown";
import styles from "./MarkdownEditor.module.css";
import "./styles.css";
import ReactMde, { commands as mdeCommands } from "react-mde-newest";

const attachCommand = {
  name: "attach",
  keyCommand: "attach",
  execute: (state, api) => null
};

const getCommandsList = () => {
  const list = [
    {
      commands: [
        mdeCommands.boldCommand,
        mdeCommands.italicCommand,
        mdeCommands.linkCommand,
        mdeCommands.quoteCommand,
        mdeCommands.codeCommand,
        mdeCommands.unorderedListCommand,
        mdeCommands.orderedListCommand
      ]
    },
    {
      commands: [attachCommand]
    }
  ];

  return list;
};

const TAB_WRITE = "write";
const TAB_PREVIEW = "preview";

const getCommandIcon = filesInput => commandName => {
  if (commandName === "attach") {
    return <>{filesInput}</>;
  }
  const command = commands.find(c => c.command === commandName);
  return <img src={command.iconSrc} />;
};

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
  }, [tab]);

  return (
    <div className={classNames(styles.container, className)}>
      <ReactMde
        selectedTab={tab}
        onTabChange={handleSwitchTab}
        generateMarkdownPreview={markdown =>
          Promise.resolve(
            <Markdown
              className={styles.previewContainer}
              body={markdown || "Nothing to preview"}
            />
          )
        }
        getIcon={getCommandIcon(filesInput)}
        commands={getCommandsList()}
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
