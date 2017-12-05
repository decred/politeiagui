import React from 'react';
import PropTypes from "prop-types";
import { ReactMdeToolbar, ReactMdeTextArea, ReactMdeCommands, ReactMdePreview } from 'react-mde';
import {
    getSelection,
} from "react-mde/lib/js/helpers/ReactMdeSelectionHelper";
import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-toolbar.css';
import 'react-mde/lib/styles/css/react-mde-textarea.css';
import 'react-mde/lib/styles/css/react-mde-preview.css';

class MarkdownEditor extends React.Component {
  textArea: HTMLTextAreaElement;
  preview: HTMLDivElement;

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
      onChange(value);
  }

  handleCommand = (command) => {
      const {value: {text}, onChange} = this.props;
      const newValue = command.execute(text, getSelection(this.textArea));
      onChange(newValue);
  }

  render() {
    const {
      value,
      showdownOptions
    } = this.props;
    return (
      <div className="react-mde">
        <ReactMdeToolbar
            commands={this.getCustomCommands()}
            onCommand={this.handleCommand}
        />
        <ReactMdeTextArea
            onChange={this.handleValueChange}
            value={value}
            textAreaRef={(c) => this.textArea = c}
        />
        <ReactMdePreview
                markdown={value.text}
                previewRef={(c) => this.preview = c}
                showdownOptions={showdownOptions}
            />
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.object.isRequired,
  showdownOptions: PropTypes.object,
};

export default MarkdownEditor;
