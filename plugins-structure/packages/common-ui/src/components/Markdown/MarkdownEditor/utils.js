function insertAt(text, pos, newText) {
  return text.substring(0, pos) + newText + text.substring(pos);
}

function countOccurences(string, term) {
  const array = string.split(term);
  return array.length - 1;
}

/**
 * getMultiLineContent returns a TextSelection for current cursor lines. It
 * will select all `content` lines between `startPos` and `endPos`. If selection
 * is at the middle of some line, the whole line is selected.
 * @param {String} content text content
 * @param {Number} startPos selection start
 * @param {Number} endPos selection end
 * @returns {{
 *  previous: String,
 *  current: String[],
 *  next: String,
 * }} Text Selection
 */
export function getMultiLineContent(content, startPos, endPos) {
  const escapeChar = "&#27;",
    numberOfEscapes = 2; // Start escape, end escape
  let newContent = content,
    escapeCount = 0,
    previousLines = [],
    selectedLines = [],
    nextLines = [];
  // add escapes on both start and end of text selection
  newContent = insertAt(newContent, startPos, escapeChar);
  newContent = insertAt(newContent, endPos + escapeChar.length, escapeChar);
  const lines = newContent.split("\n");
  for (const line of lines) {
    const numOfOccurences = countOccurences(line, escapeChar);
    // remove escape char
    const escapeRegExp = new RegExp(escapeChar, "g");
    const lineWithoutEscape = line.replace(escapeRegExp, "");
    escapeCount += numOfOccurences;
    if (!escapeCount) {
      previousLines = [...previousLines, lineWithoutEscape];
    }
    if (escapeCount === 1 || numOfOccurences === numberOfEscapes) {
      selectedLines = [...selectedLines, lineWithoutEscape];
    }
    if (escapeCount === 2 && numOfOccurences === 1) {
      selectedLines = [...selectedLines, lineWithoutEscape];
    }
    if (escapeCount === 2 && numOfOccurences === 0) {
      nextLines = [...nextLines, lineWithoutEscape];
    }
  }
  return {
    previous: previousLines.join("\n"),
    current: selectedLines,
    next: nextLines.join("\n"),
  };
}

/**
 * getSelectedContent returns a TextSelection for current cursor selection. It
 * will select the `content` between `startPos` and `endPos`.
 * @param {String} content text content
 * @param {Number} startPos selection start
 * @param {Number} endPos selection end
 * @returns {{
 *  previous: String,
 *  current: String,
 *  next: String,
 * }} Text Selection
 */
export function getSelectedContent(content, startPos, endPos) {
  const previousContent = content.substring(0, startPos);
  const nextContent = content.substring(endPos, content.length);
  const selectedString = content.substring(startPos, endPos);
  return {
    previous: previousContent,
    current: selectedString,
    next: nextContent,
  };
}

export function saveStateChanges(state) {
  const lastChange = state.previousStates[0].content;
  const currentChange = state.currentState.content;
  if (lastChange !== currentChange) {
    state.previousStates = [state.currentState, ...state.previousStates];
    // clear future changes.
    state.nextStates = [];
  }
}

export function undoStateChange(state) {
  if (state.previousStates.length) {
    // save move current state to next states
    state.nextStates = [state.currentState, ...state.nextStates];
    // if there are no changes prior to last change
    if (state.previousStates.length === 1) {
      state.currentState = state.previousStates[0];
    } else {
      const { content, selectionStart, selectionEnd } =
        state.previousStates.shift();
      state.currentState = { content, selectionStart, selectionEnd };
    }
  }
}

export function redoStateChange(state) {
  if (state.nextStates.length) {
    state.previousStates.unshift(state.currentState);
    state.currentState = state.nextStates.shift();
  }
}
