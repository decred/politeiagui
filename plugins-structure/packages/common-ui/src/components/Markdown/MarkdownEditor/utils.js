function insertAt(text, pos, newText) {
  return text.substring(0, pos) + newText + text.substring(pos);
}

function countOccurences(string, term) {
  const array = string.split(term);
  return array.length - 1;
}

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

export function saveStateChanges({ previousState, currentState }) {
  return {
    previousState: [currentState, ...previousState],
    nextState: [],
    currentState,
  };
}

export function undoStateChange({ previousState, currentState, nextState }) {
  const [lastChange, ...previousChanges] = previousState;
  if (!lastChange) {
    return { previousState, nextState, currentState };
  }
  if (!previousChanges.length) {
    return {
      currentState: lastChange,
      previousState,
      nextState: [currentState, ...nextState],
    };
  }
  return {
    currentState: lastChange,
    previousState: previousChanges,
    nextState: [currentState, ...nextState],
  };
}

export function redoStateChange({ previousState, currentState, nextState }) {
  const [lastChange, ...nextChanges] = nextState;
  if (!lastChange) {
    return { previousState, nextState: [], currentState };
  }
  return {
    currentState: lastChange,
    previousState: [currentState, ...previousState],
    nextState: nextChanges,
  };
}
