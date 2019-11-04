import React from "react";
import styles from "./InvoiceDatasheet.module.css";

class MultiLineEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnKeyDownCapture = this.handleOnKeyDownCapture.bind(this);
  }

  componentDidMount() {
    this.resizeText();
  }

  componentDidUpdate() {
    this.resizeText();
  }

  handleInputChange(event) {
    this.props.onChange(event.target.value);
  }

  // Prevents default onKeyDown if shift + enter are pressed
  handleOnKeyDownCapture(event) {
    if (event.keyCode === 13 && event.shiftKey) {
      event.stopPropagation();
    }
  }

  //Sets height and maxheight of textarea to scrollheight
  resizeText() {
    if (this.textAreaRef) {
      this.textAreaRef.style.height = this.textAreaRef.scrollHeight + "px";
      this.textAreaRef.style.maxHeight = this.textAreaRef.scrollHeight + "px";
    }
  }

  render() {
    const { value, onKeyDown } = this.props;
    return (
      <textarea
        autoFocus
        className={styles.multilineEditor}
        value={value}
        onChange={this.handleInputChange}
        onKeyDownCapture={this.handleOnKeyDownCapture}
        onKeyDown={onKeyDown}
        ref={textAreaRef => (this.textAreaRef = textAreaRef)}
      />
    );
  }
}

export default MultiLineEditor;
