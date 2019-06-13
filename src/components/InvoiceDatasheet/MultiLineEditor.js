import React from "react";

class MultiLineEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.resizeText();
  }

  componentDidUpdate() {
    this.resizeText();
  }

  //Sets height and maxheight of textarea to scrollheight
  resizeText() {
    if (this.textAreaRef) {
      this.textAreaRef.style.height = this.textAreaRef.scrollHeight + "px";
      this.textAreaRef.style.maxHeight = this.textAreaRef.scrollHeight + "px";
    }
  }

  handleInputChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    const { value, onKeyDown } = this.props;
    return (
      <textarea
        autoFocus
        className="multiline-cell-editor"
        value={value}
        onKeyDown={onKeyDown}
        onChange={this.handleInputChange}
        ref={textAreaRef => (this.textAreaRef = textAreaRef)}
      />
    );
  }
}

export default MultiLineEditor;
