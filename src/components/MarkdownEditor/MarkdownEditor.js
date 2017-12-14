import React from "react";
import PropTypes from "prop-types";
import { ReactMdeToolbar, ReactMdeTextArea, ReactMdeCommands } from "react-mde";
import {
    getSelection,
} from "react-mde/lib/js/helpers/ReactMdeSelectionHelper";
import "react-mde/lib/styles/css/react-mde.css";
import "react-mde/lib/styles/css/react-mde-toolbar.css";
import "react-mde/lib/styles/css/react-mde-textarea.css";
import "react-mde/lib/styles/css/react-mde-preview.css";
import MarkdownPreview from "./MarkdownPreview";
import MarkdownLiveHelper from "./MarkdownLiveHelper";

class MarkdownEditor extends React.Component {
  getCustomCommands = () => {
    const {
      makeHeaderCommand,
      makeBoldCommand,
      makeItalicCommand,
      makeLinkCommand,
      makeQuoteCommand,
      makeCodeCommand,
      makeUnorderedListCommand,
      makeOrderedListCommand
    } = ReactMdeCommands;
    const customCommands = [
      [makeHeaderCommand, makeBoldCommand, makeItalicCommand],
      [makeLinkCommand, makeQuoteCommand, makeCodeCommand],
      [makeUnorderedListCommand, makeOrderedListCommand]
    ]
    return customCommands;
  }

  handleValueChange = (value) => {
      const {onChange} = this.props;
      onChange(value.text);
  }

  handleCommand = (command) => {
      const {value, onChange} = this.props;
      const newValue = command.execute(value, getSelection(this.textArea));
      onChange(newValue.text);
  }

  render() {
    const { value } = this.props;
    return (
      <div className="react-mde">
        <ReactMdeToolbar
            commands={this.getCustomCommands()}
            onCommand={this.handleCommand}
        />
        <ReactMdeTextArea
            onChange={this.handleValueChange}
            value={{ text: value }}
            textAreaRef={(c) => this.textArea = c}
        />
        <MarkdownLiveHelper classToSelect="mde-preview-content" />
        <MarkdownPreview body={value} />
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string.isRequired,
};

export default MarkdownEditor;