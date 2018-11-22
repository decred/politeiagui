import React from "react";
import PropTypes from "prop-types";

export class OnKeyListener extends React.Component {
  handleKeyUp = e => {
    const { keyCode, disabled, onKeyPress } = this.props;
    const pressedEscKey = e.keyCode === keyCode && !disabled;
    if (pressedEscKey && onKeyPress) onKeyPress();
  };

  componentWillMount() {
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  render() {
    const { children, ID } = this.props;
    return <div id={ID}>{children}</div>;
  }
}

OnKeyListener.propTypes = {
  children: PropTypes.element,
  disabled: PropTypes.bool,
  keyCode: PropTypes.number,
  onClose: PropTypes.element,
  onKeyPress: PropTypes.func
};
