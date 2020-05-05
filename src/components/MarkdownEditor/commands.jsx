import React from "react";
import { commands as mdeCommands } from "react-mde-newest";
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

export const commands = [
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

const attachCommand = {
  name: "attach",
  keyCommand: "attach",
  execute: () => null
};

/**
 * Returns the commands list to be used in the react-mde toolbar
 * @returns {Array} array of commands list
 */
export const getCommandsList = (withFileInput = false) => {
  const list = [
    {
      commands: [
        mdeCommands.boldCommand,
        mdeCommands.italicCommand,
        mdeCommands.linkCommand,
        mdeCommands.quoteCommand,
        mdeCommands.codeCommand,
        mdeCommands.unorderedListCommand,
        mdeCommands.orderedListCommand
      ]
    }
  ];

  if (withFileInput) {
    return list.concat([
      {
        commands: [attachCommand]
      }
    ]);
  }

  return list;
};

/**
 * Curried function
 * @param {Object} filesInput
 * @returns {function} a function that accepts a command name parameter
 */
/**
 * Returns the React node to be displayed for a given command name.
 * @param {string} commandName
 * @returns {Object} React node
 */
export const getCommandIcon = (filesInput) => (commandName) => {
  if (commandName === "attach") {
    return <>{filesInput}</>;
  }
  const command = commands.find((c) => c.command === commandName);
  return <img alt={commandName} src={command.iconSrc} />;
};
