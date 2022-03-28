import {
  getMultiLineContent,
  getSelectedContent,
  saveStateChanges,
} from "./utils";
import { useReducer } from "react";

function commandsReducer(editorState, { command, currentChange }) {
  if (!currentChange) {
    return command(editorState);
  }
  const { content, selectionStart, selectionEnd } = currentChange;
  const cursor = getSelectedContent(content, selectionStart, selectionEnd);
  const lines = getMultiLineContent(content, selectionStart, selectionEnd);
  const { currentState, previousState, nextState } = command({
    currentChange: {
      selection: { lines, cursor, start: selectionStart, end: selectionEnd },
      content,
    },
    previousState: editorState.previousState,
    nextState: editorState.nextState,
    currentState: editorState.currentState,
  });
  return { currentState, previousState, nextState };
}

function regularChangeAction({ currentChange: { content }, ...state }) {
  return {
    ...state,
    currentState: {
      ...state.currentState,
      content,
    },
  };
}

function initializeEditor(initialValue) {
  return {
    currentState: {
      content: initialValue,
      selectionStart: initialValue.length,
      selectionEnd: initialValue.length,
    },
    previousState: [
      {
        content: initialValue,
        selectionStart: initialValue.length,
        selectionEnd: initialValue.length,
      },
    ],
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
      command: regularChangeAction,
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
