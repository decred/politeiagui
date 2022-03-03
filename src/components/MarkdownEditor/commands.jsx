import React from "react";
import { ReactComponent as BoldSVG } from "./assets/bold.svg";
import { ReactComponent as ItalicSVG } from "./assets/italic.svg";
import { ReactComponent as QuoteSVG } from "./assets/quote.svg";
import { ReactComponent as CodeSVG } from "./assets/code.svg";
import { ReactComponent as BulletListSVG } from "./assets/bulletList.svg";
import { ReactComponent as ImageSVG } from "./assets/image.svg";
import { ReactComponent as NumberedListSVG } from "./assets/numberedList.svg";

const commandTypes = {
  numberedList: "ordered-list",
  bulletList: "unordered-list",
  bold: "bold",
  italic: "italic",
  quote: "quote",
  code: "code",
  image: "image",
  saveImage: "save-image"
};

export const toolbarCommands = (allowImgs) =>
  allowImgs
    ? [
        [],
        [],
        [
          "bold",
          "italic",
          "quote",
          "code",
          "ordered-list",
          "unordered-list",
          "image",
          "attach-files"
        ]
      ]
    : [
        [],
        [],
        [
          "bold",
          "italic",
          "quote",
          "code",
          "ordered-list",
          "unordered-list",
          "attach-files"
        ]
      ];

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
    command: commandTypes.image,
    tooltipText: "Add an image",
    Icon: ImageSVG
  },
  {
    command: commandTypes.numberedList,
    tooltipText: "Add a numbered list",
    Icon: NumberedListSVG
  },
  {
    command: commandTypes.saveImage,
    tooltipText: "Add an image",
    Icon: ImageSVG
  }
];

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
export const getCommandIcon = (commandName) => {
  const command = commands.find((c) => c.command === commandName);
  const { Icon } = command;
  return <Icon />;
};
