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
    this.textArea.style.height = "auto";
    this.textArea.style.height = (this.textArea.scrollHeight) + "px";
    const {onChange} = this.props;
    onChange(value.text);
  }

  handleCommand = (command) => {
      const {value, onChange} = this.props;
      const newValue = command.execute(value, getSelection(this.textArea));
      onChange(newValue.text);
  }

  componentDidMount() {
    const tx = this.textArea;
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;");
    }
  }

  render() {
    const { value } = this.props;
    return (
      <div className="react-mde">
        <ReactMdeToolbar
            commands={this.getCustomCommands()}
            onCommand={this.handleCommand}
        />
        <div style={{display: "flex", justifyContent: "space-between" }}>
          <ReactMdeTextArea
              onChange={this.handleValueChange}
              value={{ text: value }}
              textAreaRef={(c) => this.textArea = c}
          />
          <MarkdownPreview body={value} />
        </div>
        <div className="mde-help">
          <MarkdownLiveHelper classToSelect="mde-preview-content" />
        </div>
      </div>
    );
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string.isRequired,
};

export default MarkdownEditor;