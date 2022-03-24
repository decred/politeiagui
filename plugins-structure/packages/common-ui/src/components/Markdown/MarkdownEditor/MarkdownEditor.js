import React, { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./MarkdownEditor.module.css";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { commands, executeCommand } from "./commands";

export function MarkdownEditor({
  onChange,
  wrapperClassName,
  initialValue = "",
  isSplitView,
  customCommands = [],
}) {
  const editorRef = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const [value, setValue] = useState(initialValue);
  const availableCommands = useMemo(
    () => [...customCommands, ...commands],
    [customCommands]
  );

  function handleChange(e) {
    setValue(e.target.value);
    onChange(e.target.value);
  }
  function handleShowPreview() {
    setShowPreview(true);
  }
  function handleShowWrite() {
    setShowPreview(false);
  }

  const handleCommand =
    (command, { offset = 0 } = {}) =>
    () => {
      const content = editorRef.current.value;
      const startPos = editorRef.current.selectionStart;
      const endPos = editorRef.current.selectionEnd;
      const newString = executeCommand(command, content, startPos, endPos);
      // prevent sync issues between textarea updates.
      setTimeout(() => {
        setValue(newString);
        onChange(newString);
        editorRef.current.focus();
        editorRef.current.selectionStart = startPos + offset;
        editorRef.current.selectionEnd = endPos + offset;
      }, 1);
    };

  function handleKeyPress(event) {
    if (event.metaKey || event.ctrlKey) {
      const cmd = availableCommands.find((c) => c.commandKey === event.key);
      if (cmd) {
        const { command, offset } = cmd;
        handleCommand(command, { offset })();
      }
    }
  }

  return (
    <div className={classNames(styles.editorWrapper, wrapperClassName)}>
      <div className={styles.headers}>
        <div className={classNames(isSplitView && styles.hide, styles.tabs)}>
          <div onClick={handleShowWrite}>Write</div>
          <div onClick={handleShowPreview}>Preview</div>
        </div>
        <div className={styles.actionButtons}>
          {availableCommands.map(({ command, Icon, offset }, i) => (
            <span key={i} onClick={handleCommand(command, { offset })}>
              <Icon />
            </span>
          ))}
        </div>
      </div>
      <div
        className={classNames(
          styles.content,
          !isSplitView
            ? showPreview
              ? styles.hideEditor
              : styles.hidePreview
            : styles.splitView
        )}
      >
        <textarea
          id="markdown-editor"
          ref={editorRef}
          className={styles.editor}
          value={value}
          onKeyPress={handleKeyPress}
          onChange={handleChange}
          // onSelect={(e) => console.log("EVENT", e)}
        />
        <MarkdownRenderer body={value} className={styles.preview} />
      </div>
    </div>
  );
}

MarkdownEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  wrapperClassName: PropTypes.string,
  initialValue: PropTypes.string,
  isSplitView: PropTypes.bool,
  customCommands: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
      command: PropTypes.func.isRequired,
    })
  ),
};
