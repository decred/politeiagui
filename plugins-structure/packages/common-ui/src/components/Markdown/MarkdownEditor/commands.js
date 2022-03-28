import React from "react";
import { ButtonIcon } from "pi-ui";
import { redoStateChange, saveStateChanges, undoStateChange } from "./utils";

function formatEachLine(lines, formatFn, { ignoreBlankLines } = {}) {
  let index = 0;
  return lines.reduce((acc, curr, i) => {
    if (ignoreBlankLines && curr.length === 0 && i) {
      return `${acc}\n`;
    }
    index++;
    return `${acc}${!!i ? "\n" : ""}${formatFn(curr, index)}`;
  }, "");
}

// Multiline command interface
const multiLineCommand =
  (execFn, { offset, ignoreBlankLines }) =>
  ({ currentChange, ...stateChanges }) => {
    const savedState = saveStateChanges(stateChanges);
    const { start, end, lines } = currentChange.selection;
    const { previous, current, next } = lines;
    const formattedLines = formatEachLine(current, execFn, {
      ignoreBlankLines,
    });
    let newPrev = `${previous}\n`;
    if (previous.length === 0) {
      newPrev = "";
    }
    return {
      ...savedState,
      currentState: {
        content: `${newPrev}${formattedLines}\n${next}`,
        selectionStart: start + offset,
        selectionEnd: end + offset,
      },
    };
  };

// cursor selection command interface
export const cursorSelectionCommand =
  (cmd, { offset }) =>
  ({ currentChange, ...stateChanges }) => {
    const savedState = saveStateChanges(stateChanges);
    const {
      selection: { cursor, start, end },
    } = currentChange;
    const newContent = cmd(cursor);
    return {
      ...savedState,
      currentState: {
        content: newContent,
        selectionStart: start + offset,
        selectionEnd: end + offset,
      },
    };
  };

// Available commands
export const commands = [
  {
    label: "Undo",
    commandKey: "z",
    command: undoStateChange,
  },
  {
    label: "Redo",
    commandKey: "z",
    shift: true,
    command: redoStateChange,
  },
  {
    label: "Bold Text",
    commandKey: "b",
    Button: ({ onClick }) => (
      <ButtonIcon type="bold" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: cursorSelectionCommand(
      ({ previous, current, next }) => `${previous}**${current}**${next}`,
      { offset: 2 }
    ),
  },
  {
    label: "Italic",
    commandKey: "i",
    Button: ({ onClick }) => (
      <ButtonIcon type="italic" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: cursorSelectionCommand(
      ({ previous, current, next }) => `${previous}_${current}_${next}`,
      { offset: 1 }
    ),
  },
  {
    label: "Quote",
    Button: ({ onClick }) => (
      <ButtonIcon type="quote" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: multiLineCommand((curr) => `> ${curr}`, {
      offset: 2,
      ignoreBlankLines: true,
    }),
  },
  {
    label: "Code",
    Button: ({ onClick }) => (
      <ButtonIcon type="code" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: cursorSelectionCommand(
      ({ previous, current, next }) => `${previous}\`${current}\`${next}`,
      { offset: 2 }
    ),
  },

  {
    label: "List",
    Button: ({ onClick }) => (
      <ButtonIcon type="bulletList" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: multiLineCommand((curr) => `- ${curr}`, {
      offset: 2,
      ignoreBlankLines: true,
    }),
  },
  {
    label: "Numbered List",
    Button: ({ onClick }) => (
      <ButtonIcon type="numberedList" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: multiLineCommand((curr, i) => `${i}. ${curr}`, {
      offset: 3,
      ignoreBlankLines: true,
    }),
  },
  {
    label: "Task List",
    Button: ({ onClick }) => (
      <ButtonIcon type="taskList" onClick={onClick} viewBox="0 0 16 16" />
    ),
    command: multiLineCommand((curr) => `- [ ] ${curr}`, {
      offset: 5,
      ignoreBlankLines: true,
    }),
  },
];
