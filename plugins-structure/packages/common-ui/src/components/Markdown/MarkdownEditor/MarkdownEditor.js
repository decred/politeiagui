import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./MarkdownEditor.module.css";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { commands } from "./commands";
import { useMarkdownEditor } from "./hooks";

export function MarkdownEditor({
  onChange,
  wrapperClassName,
  initialValue = "",
  isSplitView,
  hideButtonsMenu,
  customCommands = [],
}) {
  const editorRef = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const availableCommands = useMemo(
    () => [...customCommands, ...commands],
    [customCommands]
  );
  const {
    value: editorValue,
    selectionEnd,
    selectionStart,
    onChange: onEditorChange,
    onCommand,
    onSaveChanges,
  } = useMarkdownEditor(initialValue);

  function handleInputChange(e) {
    onEditorChange(e.target.value);
  }

  function handleShowPreview() {
    setShowPreview(true);
  }

  function handleShowWrite() {
    setShowPreview(false);
  }

  const handleCommand = (command) => () => {
    const content = editorRef.current.value;
    const selectionStart = editorRef.current.selectionStart;
    const selectionEnd = editorRef.current.selectionEnd;
    onCommand(command, {
      content,
      selectionEnd,
      selectionStart,
    });
  };

  function handleKeyPress(event) {
    const keyIsNotDigit = event.key.match(/[^a-zA-Z0-9]/);
    const isBackspace = event.key === "Backspace";
    const isEnter = event.key === "Enter";
    if (keyIsNotDigit || isBackspace || isEnter) {
      onSaveChanges();
    }
    if (event.metaKey || event.ctrlKey) {
      const cmd = availableCommands.find(
        (c) => c.commandKey === event.key && !!c.shift === event.shiftKey
      );
      if (cmd) {
        event.preventDefault();
        const { command } = cmd;
        handleCommand(command)();
      }
    }
  }

  useEffect(
    function handleCursorChanges() {
      if (selectionStart || selectionEnd) {
        editorRef.current.focus();
        editorRef.current.selectionStart = selectionStart;
        editorRef.current.selectionEnd = selectionEnd;
      }
    },
    [selectionEnd, selectionStart]
  );

  useEffect(
    function handleEditorChanges() {
      onChange(editorValue);
    },
    [editorValue, onChange]
  );

  return (
    <div className={classNames(styles.editorWrapper, wrapperClassName)}>
      <div className={styles.headers}>
        <div className={classNames(isSplitView && styles.hide, styles.tabs)}>
          <div onClick={handleShowWrite}>Write</div>
          <div onClick={handleShowPreview}>Preview</div>
        </div>
        {!hideButtonsMenu && (
          <div className={styles.actionButtons}>
            {availableCommands.map(
              ({ command, Button, offset }, i) =>
                Button && (
                  <Button
                    key={i}
                    className={styles.buttonIcon}
                    onClick={handleCommand(command, { offset })}
                  />
                )
            )}
          </div>
        )}
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
          data-testid="markdown-editor"
          ref={editorRef}
          className={styles.editor}
          value={editorValue}
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          onBlur={() => onSaveChanges()}
        />
        <MarkdownRenderer body={editorValue} className={styles.preview} />
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
      commandKey: PropTypes.string,
      shift: PropTypes.bool,
      Button: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
      command: PropTypes.func.isRequired,
    })
  ),
};
