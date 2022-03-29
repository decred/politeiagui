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

export function createCommand({
  label,
  commandKey,
  command,
  shift,
  buttonType,
  buttonViewBox,
} = {}) {
  return {
    label,
    commandKey,
    shift,
    Button: ({ onClick }) => (
      <ButtonIcon type={buttonType} onClick={onClick} viewBox={buttonViewBox} />
    ),
    command: (state) => {
      saveStateChanges(state);
      command(state);
    },
  };
}

// Multiline command interface
export const multiLineCommand =
  (lineFormatterFn, { offset, ignoreBlankLines }) =>
  (state) => {
    const { currentChange } = state;
    const { start, end, lines } = currentChange.selection;
    const { previous, current, next } = lines;
    const formattedLines = formatEachLine(current, lineFormatterFn, {
      ignoreBlankLines,
    });
    let newPrev = `${previous}\n`;
    if (previous.length === 0) {
      newPrev = "";
    }
    state.currentState = {
      content: `${newPrev}${formattedLines}\n${next}`,
      selectionStart: start + offset,
      selectionEnd: end + offset,
    };
  };

export const cursorSelectionCommand =
  (cmd, { offset }) =>
  (state) => {
    const {
      selection: { cursor, start, end },
    } = state.currentChange;
    const newContent = cmd(cursor);
    state.currentState.content = newContent;
    state.currentState.selectionStart = start + offset;
    state.currentState.selectionEnd = end + offset;
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
  createCommand({
    label: "Bold Text",
    commandKey: "b",
    buttonType: "bold",
    buttonViewBox: "0 0 16 16",
    command: cursorSelectionCommand(
      ({ previous, current, next }) => `${previous}**${current}**${next}`,
      { offset: 2 }
    ),
  }),
  createCommand({
    label: "Italic",
    commandKey: "i",
    buttonType: "italic",
    buttonViewBox: "0 0 16 16",
    command: cursorSelectionCommand(
      ({ previous, current, next }) => `${previous}_${current}_${next}`,
      { offset: 1 }
    ),
  }),
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
      { offset: 1 }
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
