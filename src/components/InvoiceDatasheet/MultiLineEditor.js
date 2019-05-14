import React from "react";

class MultiLineEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this._input.focus();
  }

  handleInputChange(event) {
    this.props.onChange(event.target.value);
  }

  render() {
    const { value, onKeyDown } = this.props;
    return (
      <textarea
        ref={input => {
          this._input = input;
        }}
        value={value}
        onChange={this.handleInputChange}
        onKeyDown={onKeyDown}
      />
    );
  }
}

export default MultiLineEditor;
