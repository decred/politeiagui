import React from "react";
import { commands as mdeCommands } from "react-mde-newest";
import { ReactComponent as BoldSVG } from "./assets/bold.svg";
import { ReactComponent as ItalicSVG } from "./assets/italic.svg";
import { ReactComponent as QuoteSVG } from "./assets/quote.svg";
import { ReactComponent as LinkSVG } from "./assets/link.svg";
import { ReactComponent as CodeSVG } from "./assets/code.svg";
import { ReactComponent as BulletListSVG } from "./assets/bulletList.svg";
import { ReactComponent as NumberedListSVG } from "./assets/numberedList.svg";

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
    Icon: BoldSVG
  },
  {
    command: commandTypes.italic,
    tooltipText: "Add italic text",
    Icon: ItalicSVG
  },
  {
    command: commandTypes.link,
    tooltipText: "Insert a link",
    Icon: LinkSVG
  },
  {
    command: commandTypes.quote,
    tooltipText: "Insert a quote",
    Icon: QuoteSVG
  },
  {
    command: commandTypes.code,
    tooltipText: "Insert code",
    Icon: CodeSVG
  },
  {
    command: commandTypes.bulletList,
    tooltipText: "Add a bullet list",
    Icon: BulletListSVG
  },
  {
    command: commandTypes.numberedList,
    tooltipText: "Add a numbered list",
    Icon: NumberedListSVG
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
  const { Icon } = command;
  return <Icon />;
};
