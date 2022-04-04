import { saveStateChanges } from "./utils";
import {
  commandsReducer,
  initializeEditorReducer,
  regularChangeCommand,
} from "./commands";
import { useReducer } from "react";

export function useMarkdownEditor(initialValue = "") {
  const [state, dispatch] = useReducer(
    commandsReducer,
    initializeEditorReducer(initialValue)
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
