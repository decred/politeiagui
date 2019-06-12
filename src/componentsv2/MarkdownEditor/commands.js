import boldSVG from "./assets/bold.svg";
import italicSVG from "./assets/italic.svg";
import linkSVG from "./assets/link.svg";
import quoteSVG from "./assets/quote.svg";
import codeSVG from "./assets/code.svg";
import bulletListSVG from "./assets/bulletList.svg";
import numberedListSVG from "./assets/numberedList.svg";

const commandTypes = {
  numberedList: "ordered-list",
  bulletList: "unordered-list",
  bold: "bold",
  italic: "italic",
  link: "link",
  quote: "quote",
  code: "code"
};

const commands = [
  {
    command: commandTypes.bold,
    tooltipText: "Add bold text",
    iconSrc: boldSVG
  },
  {
    command: commandTypes.italic,
    tooltipText: "Add italic text",
    iconSrc: italicSVG
  },
  {
    command: commandTypes.link,
    tooltipText: "Insert a link",
    iconSrc: linkSVG
  },
  {
    command: commandTypes.quote,
    tooltipText: "Insert a quote",
    iconSrc: quoteSVG
  },
  {
    command: commandTypes.code,
    tooltipText: "Insert code",
    iconSrc: codeSVG
  },
  {
    command: commandTypes.bulletList,
    tooltipText: "Add a bullet list",
    iconSrc: bulletListSVG
  },
  {
    command: commandTypes.numberedList,
    tooltipText: "Add a numbered list",
    iconSrc: numberedListSVG
  }
];

export default commands;
