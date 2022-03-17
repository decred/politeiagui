import React, { useRef, useState } from "react";
import { classNames } from "pi-ui";
import styles from "./MarkdownEditor.module.css";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { commands, getLineContent, getSelectedContent } from "./commands";

export function MarkdownEditor({
  onChange,
  wrapperClassName,
  initialValue = "",
  isSplitView,
}) {
  const editorRef = useRef();
  const [showPreview, setShowPreview] = useState(false);
  const [value, setValue] = useState(initialValue);
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
  const handleCommand = (command) => () => {
    const content = editorRef.current.value;
    const startPos = editorRef.current.selectionStart;
    const endPos = editorRef.current.selectionEnd;
    const selected = getSelectedContent(content, startPos, endPos);
    const line = getLineContent(content, startPos);
    const newString = command({ line, selected });
    setValue(newString);
    onChange(newString);
  };

  return (
    <div className={classNames(styles.editorWrapper, wrapperClassName)}>
      <div className={styles.headers}>
        <div className={classNames(isSplitView && styles.hide, styles.tabs)}>
          <div onClick={handleShowWrite}>Write</div>
          <div onClick={handleShowPreview}>Preview</div>
        </div>
        <div className={styles.actionButtons}>
          {commands.map(({ command, Icon }, i) => (
            <span key={i} onClick={handleCommand(command)}>
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
          onChange={handleChange}
        />
        <MarkdownRenderer body={value} className={styles.preview} />
      </div>
    </div>
  );
}
