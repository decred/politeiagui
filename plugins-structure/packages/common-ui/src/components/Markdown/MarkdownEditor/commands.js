import BoldSVG from "./assets/bold.svg";
import ItalicSVG from "./assets/italic.svg";
import QuoteSVG from "./assets/quote.svg";
import CodeSVG from "./assets/code.svg";
import BulletListSVG from "./assets/bulletList.svg";
// import { ReactComponent as ImageSVG } from "./assets/image.svg";
// import { ReactComponent as NumberedListSVG } from "./assets/numberedList.svg";

export const commands = [
  {
    label: "Bold Text",
    Icon: BoldSVG,
    command: ({ selected: { previous, current, next } }) =>
      `${previous}**${current}**${next}`,
  },
  {
    label: "Italic",
    Icon: ItalicSVG,
    command: ({ selected: { previous, current, next } }) =>
      `${previous}*${current}*${next}`,
  },
  {
    label: "Quote",
    Icon: QuoteSVG,
    command: ({ line: { previous, current, next } }) =>
      `${previous}\n> ${current}\n${next}`,
  },
  {
    label: "Code",
    Icon: CodeSVG,
    command: ({ selected: { previous, current, next } }) =>
      `${previous}\`${current}\`${next}`,
  },
  {
    label: "List",
    Icon: BulletListSVG,
    command: ({ line: { previous, current, next } }) =>
      `${previous}\n- ${current}\n${next}`,
  },
];

export function getLineContent(content, startPos) {
  const lines = content.split("\n");
  let acc = 0,
    selectedLine = "",
    previousLines = [],
    nextLines = [...lines];
  for (const line of lines) {
    acc += line.length;
    nextLines = nextLines.splice(1, lines.length);
    if (acc >= startPos - 1) {
      selectedLine = line;
      break;
    }
    previousLines = [...previousLines, line];
  }
  return {
    previous: previousLines.join("\n"),
    current: selectedLine,
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
