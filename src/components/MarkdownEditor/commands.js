import React from "react";
import boldSVG from "./assets/bold.svg";
import italicSVG from "./assets/italic.svg";
import linkSVG from "./assets/link.svg";
import quoteSVG from "./assets/quote.svg";
import codeSVG from "./assets/code.svg";
import bulletListSVG from "./assets/bulletList.svg";
import numberedListSVG from "./assets/numberedList.svg";
import imageSVG from "./assets/image.svg";

export const toolbarCommands = [
  [],
  [],
  [
    "bold",
    "italic",
    "link",
    "quote",
    "code",
    "ordered-list",
    "unordered-list",
    "image",
    "attach-files"
  ]
];

const commandsIcons = {
  "ordered-list": numberedListSVG,
  "unordered-list": bulletListSVG,
  bold: boldSVG,
  italic: italicSVG,
  link: linkSVG,
  quote: quoteSVG,
  code: codeSVG,
  image: imageSVG
};

/**
 * Returns the React node to be displayed for a given command name.
 * @param {string} commandName
 * @returns {Object} React node
 */
export const getCommandIcon = (commandName) => {
  return <img alt={commandName} src={commandsIcons[commandName]} />;
};
