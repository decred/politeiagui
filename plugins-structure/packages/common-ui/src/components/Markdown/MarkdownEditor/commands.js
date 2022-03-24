import BoldSVG from "./assets/bold.svg";
import ItalicSVG from "./assets/italic.svg";
import QuoteSVG from "./assets/quote.svg";
import CodeSVG from "./assets/code.svg";
import BulletListSVG from "./assets/bulletList.svg";
import NumberedListSVG from "./assets/numberedList.svg";
// TODO: Add image command

function formatEachLine(lines, formatFn, { ignoreBlankLines } = {}) {
  let index = 0;
  return lines.reduce((acc, curr, i) => {
    if (ignoreBlankLines && curr.length === 0) {
      return `${acc}\n`;
    }
    index++;
    return `${acc}${!!i ? "\n" : ""}${formatFn(curr, index)}`;
  }, "");
}

// Multiline command interface
const multiLineCommand =
  (execFn, options) =>
  ({ lines: { previous, current, next } }) => {
    const formattedLines = formatEachLine(current, execFn, options);
    let newPrev = `${previous}\n`;
    if (previous.length === 0) {
      newPrev = "";
    }
    return `${newPrev}${formattedLines}\n${next}`;
  };

// Available commands
export const commands = [
  {
    label: "Bold Text",
    commandKey: "b",
    offset: 2,
    Icon: BoldSVG,
    command: ({ selected: { previous, current, next } }) =>
      `${previous}**${current}**${next}`,
  },
  {
    label: "Italic",
    commandKey: "i",
    offset: 1,
    Icon: ItalicSVG,
    command: ({ selected: { previous, current, next } }) =>
      `${previous}_${current}_${next}`,
  },
  {
    label: "Quote",
    Icon: QuoteSVG,
    offset: 2,
    command: multiLineCommand((curr) => `> ${curr}`, {
      ignoreBlankLines: true,
    }),
  },
  {
    label: "Code",
    Icon: CodeSVG,
    offset: 1,
    command: ({ selected: { previous, current, next } }) =>
      `${previous}\`${current}\`${next}`,
  },
  {
    label: "List",
    Icon: BulletListSVG,
    offset: 2,
    command: multiLineCommand((curr) => `- ${curr}`, {
      ignoreBlankLines: true,
    }),
  },
  {
    label: "Numbered List",
    Icon: NumberedListSVG,
    offset: 3,
    command: multiLineCommand((curr, i) => `${i}. ${curr}`, {
      ignoreBlankLines: true,
    }),
  },
];

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

export function executeCommand(command, content, startPos, endPos) {
  const selected = getSelectedContent(content, startPos, endPos);
  const lines = getMultiLineContent(content, startPos, endPos);
  return command({ selected, lines });
}
