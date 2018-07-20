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

const DefaultLayout = ({ Toolbar, TextArea, Preview, LiveHelper, style }) => (
  <div className="react-mde" style={{ ...style }}>
    {Toolbar}
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {TextArea}
      {Preview}
    </div>
    <div className="mde-help">
      {LiveHelper}
    </div>
  </div>
);

class TogglerLayout extends React.Component {
  state = {
    previewActive: false
  }
  render() {
    const { Preview, TextArea, Toolbar, value, style } = this.props;
    const { previewActive } = this.state;
    const toggleContainerStyle = {
      position: "absolute",
      top: "14px",
      right: "10px",
      cursor: "pointer",
      fontSize: "18px"
    };
    const toggleWriteStyle = {
      color: previewActive ? "#767676" : "#0079d3",
      marginRight: "6px"
    };
    const togglePreviewStyle = {
      color: previewActive ? "#0079d3" : "#767676"
    };
    const previewContainerStyle = {
      paddingTop: "48px",
      width: "100%",
      background: "white"
    };
    const nothingToPreviewMessageStyle = {
      fontSize: "18px",
      width: "100%",
      textAlign: "center"
    };
    return (
      <div style={{ position: "relative", ...style }}>
        <div style={toggleContainerStyle}>
          <span style={toggleWriteStyle} onClick={() => this.setState({ previewActive: false })} >Write</span>
          <span style={togglePreviewStyle} onClick={() => this.setState({ previewActive: true })}>Preview</span>
        </div>
        {previewActive ?
          <div style={previewContainerStyle}>
            {!value ? <span style={nothingToPreviewMessageStyle}>Nothing to preview</span> : Preview}</div>
          :
          <div className="react-mde" style={{ background: "white" }}>
            {Toolbar}
            {TextArea}
          </div>
        }
      </div>
    );
  }
}

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
    ];
    return customCommands;
  }

  handleValueChange = (value) => {
    if (!this.props.toggledStyle) {
      this.textArea.style.height = "auto";
      this.textArea.style.height = (this.textArea.scrollHeight) + "px";
    }
    const { onChange } = this.props;
    onChange(value.text);
  }

  handleCommand = (command) => {
    const { value, onChange } = this.props;
    const newValue = command.execute(value, getSelection(this.textArea));
    onChange(newValue.text);
  }

  componentDidMount() {
    if (!this.props.toggledStyle) {
      const tx = this.textArea;
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;");
      }
    }
    if(typeof this.props.tabIndex !== "undefined") {
      this.textArea.setAttribute("tabindex", this.props.tabIndex);
    }
  }

  render() {
    const { value, toggledStyle, style } = this.props;
    const Toolbar = (
      <ReactMdeToolbar
        commands={this.getCustomCommands()}
        onCommand={this.handleCommand}
      />
    );
    const TextArea = (
      <ReactMdeTextArea
        onChange={this.handleValueChange}
        value={{ text: value }}
        textAreaRef={(c) => this.textArea = c}
      />
    );
    const Preview = (
      <MarkdownPreview body={value} />
    );
    const LiveHelper = (
      <MarkdownLiveHelper classToSelect="mde-preview-content" />
    );

    return (
      toggledStyle ?
        <TogglerLayout
          style={style}
          Toolbar={Toolbar}
          TextArea={
            <ReactMdeTextArea
              onChange={this.handleValueChange}
              value={{ text: value }}
              textAreaProps={{
                style: { overflowY: "auto" }
              }}
              textAreaRef={(c) => this.textArea = c}
            />
          }
          Preview={<MarkdownPreview body={value} fullWidth />}
          LiveHelper={LiveHelper}
          value={value}
        />
        :
        <DefaultLayout
          style={style}
          Toolbar={Toolbar}
          TextArea={TextArea}
          Preview={Preview}
          LiveHelper={LiveHelper}
        />
    );
  }
}

MarkdownEditor.propTypes = {
  value: PropTypes.string.isRequired,
  toggledStyle: PropTypes.bool
};

export default MarkdownEditor;
