import React from "react";
import PropTypes from "prop-types";

export class OnKeyListener extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEventListener: false
    };
  }
  handleKeyUp = e => {
    const { keyCode, disabled, onKeyPress } = this.props;
    const pressedEscKey = e.keyCode === keyCode && !disabled;
    if (pressedEscKey && onKeyPress) onKeyPress();
  };

  componentDidMount() {
    if (!this.props.disabled) {
      this.setState({ isEventListener: true }, () =>
        window.addEventListener("keyup", this.handleKeyUp)
      );
    }
  }

  componentDidUpdate() {
    //Used to remove extraneous eventListener from previous modal.
    if (this.state.isEventListener === true) {
      window.removeEventListener("keyup", this.handleKeyUp);
    }
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
