import {
  getMultiLineContent,
  getSelectedContent,
  saveStateChanges,
} from "./utils";
import { useReducer } from "react";
import { createNextState } from "@reduxjs/toolkit";

function commandsReducer(editorState, { command, currentChange }) {
  if (!currentChange) {
    return createNextState(command)(editorState);
  }
  const { content, selectionStart, selectionEnd } = currentChange;
  const cursor = getSelectedContent(content, selectionStart, selectionEnd);
  const lines = getMultiLineContent(content, selectionStart, selectionEnd);
  const { currentState, previousState, nextState } = createNextState(command)({
    currentChange: {
      selection: { lines, cursor, start: selectionStart, end: selectionEnd },
      content,
    },
    ...editorState,
  });
  return { currentState, previousState, nextState };
}

const regularChangeCommand = (state) => {
  state.currentState.content = state.currentChange.content;
};

function initializeEditor(initialValue) {
  return {
    currentState: {
      content: initialValue,
      selectionStart: initialValue.length,
      selectionEnd: initialValue.length,
    },
    previousState: [{ content: "", selectionStart: 0, selectionEnd: 0 }],
    nextState: [],
  };
}

export function useMarkdownEditor(initialValue = "") {
  const [state, dispatch] = useReducer(
    commandsReducer,
    initializeEditor(initialValue)
  );

  function onChange(value) {
    dispatch({
      command: regularChangeCommand,
      currentChange: {
        content: value,
      },
    });
  }

  function onSaveChanges() {
    dispatch({ command: saveStateChanges });
  }

  function onCommand(command, { content, selectionStart, selectionEnd } = {}) {
    dispatch({
      command,
      currentChange: { content, selectionStart, selectionEnd },
    });
  }

  return {
    value: state.currentState.content,
    selectionStart: state.currentState.selectionStart,
    selectionEnd: state.currentState.selectionEnd,
    onCommand,
    onChange,
    onSaveChanges,
  };
}
