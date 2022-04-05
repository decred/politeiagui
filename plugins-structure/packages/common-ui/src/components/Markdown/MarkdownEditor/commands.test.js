import {
  commandsMap,
  commandsReducer,
  createEditorCommand,
  initializeEditorReducer,
  regularChangeCommand,
} from "./commands";

describe("Given initializeEditorReducer", () => {
  it("should return the correct initial state", () => {
    const initialState = initializeEditorReducer("content");
    expect(initialState).toEqual({
      currentState: {
        content: "content",
        selectionStart: 7,
        selectionEnd: 7,
      },
      previousStates: [
        {
          content: "content",
          selectionStart: 7,
          selectionEnd: 7,
        },
      ],
      nextStates: [],
    });
  });
});

describe("Given createEditorCommand", () => {
  it("should return the correct Markdown Editor Command", () => {
    const editorCommand = createEditorCommand({
      label: "My Command",
      commandKey: "k",
      command: (state) => state,
    });
    expect(editorCommand.label).toEqual("My Command");
    expect(editorCommand.commandKey).toEqual("k");
    expect(editorCommand.shift).not.toBeDefined();
    expect(editorCommand.Button).toBeNull();
    expect(editorCommand.command).toBeFunction();
  });
});

describe("Given commandsReducer", () => {
  const state = {
    currentState: {
      content: "Content",
      selectionStart: 7,
      selectionEnd: 7,
    },
    previousStates: [
      {
        content: "",
        selectionStart: 0,
        selectionEnd: 0,
      },
    ],
    nextStates: [],
  };
  describe("when en empty command is dispatched", () => {
    it("should return the initial state", () => {
      const newState = commandsReducer(state, {
        command: () => {},
      });
      expect(newState).toEqual(state);
    });
  });
  describe("when a command dispatches some state changes", () => {
    it("should return the initial state", () => {
      const newState = commandsReducer(state, {
        command: regularChangeCommand,
        currentChange: {
          content: "New Content",
        },
      });
      expect(newState).toEqual({
        ...state,
        currentState: { ...state.currentState, content: "New Content" },
      });
    });
  });
  describe("when a command clears the current state", () => {
    it("should return the initial state", () => {
      const newState = commandsReducer(state, {
        command: (state) => {
          state.currentState.content = "";
        },
      });
      expect(newState).toEqual({
        ...state,
        currentState: { ...state.currentState, content: "" },
      });
    });
  });
  describe("when default editor commands are dispatched", () => {
    const currentChange = {
      selectionStart: 0,
      selectionEnd: 7,
      content: "Content",
    };
    describe("undo command", () => {
      it("should return previous state last content", () => {
        const { command } = commandsMap.undo;
        const newState = commandsReducer(state, { command });
        expect(newState.currentState.content).toEqual("");
      });
    });
    describe("redo command", () => {
      it("should return next state last content", () => {
        const { command } = commandsMap.redo;
        const newState = commandsReducer(
          {
            ...state,
            nextStates: [
              {
                content: "next",
              },
            ],
          },
          { command }
        );
        expect(newState.currentState.content).toEqual("next");
      });
    });
    describe("bold command", () => {
      it("should return content between **'s: **content**", () => {
        const { command } = commandsMap.bold;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("**Content**");
      });
    });
    describe("italic command", () => {
      it("should return content between _'s: _Content_", () => {
        const { command } = commandsMap.italic;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("_Content_");
      });
    });
    describe("code command", () => {
      it("should return content between `'s: `Content`", () => {
        const { command } = commandsMap.code;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("`Content`");
      });
    });
    describe("quote command", () => {
      it("should return '>' at the beginning of the line: > Content", () => {
        const { command } = commandsMap.quote;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("> Content\n");
      });
    });
    describe("list command", () => {
      it("should return '-' at the beginning of the line: - Content", () => {
        const { command } = commandsMap.list;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("- Content\n");
      });
    });
    describe("numberedList command", () => {
      it("should return '1.' at the beginning of the line: 1. Content", () => {
        const { command } = commandsMap.numberedList;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("1. Content\n");
      });
    });
    describe("taskList command", () => {
      it("should return '- [ ] ' at the beginning of the line: - [ ] Content", () => {
        const { command } = commandsMap.taskList;
        const newState = commandsReducer(state, { command, currentChange });
        expect(newState.currentState.content).toEqual("- [ ] Content\n");
      });
    });
  });
});
