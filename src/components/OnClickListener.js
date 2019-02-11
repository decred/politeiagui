import React from "react";
import PropTypes from "prop-types";

class OnClickListener extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0,
      isEventListener: false
    };
  }

  handleOnClick = event => {
    const { clicks } = this.state;
    const { disabled } = this.props;
    this.setState({ clicks: clicks + 1 });
    if (!event.target.closest(".modal-content") && clicks > 0 && !disabled) {
      if (!event.target.closest(".right") && !event.target.closest(".left")) {
        this.props.onClick();
      }
    }
  };

  componentDidMount() {
    if (!this.props.disabled) {
      this.setState({ isEventListener: true }, () =>
        window.addEventListener("click", this.handleOnClick)
      );
    }
  }

  componentDidUpdate() {
    //Used to remove extraneous onClickListener from previous modal.
    if (this.state.isEventListener === true && this.state.clicks > 1) {
      window.removeEventListener("click", this.handleOnClick);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleOnClick);
  }

  render() {
    const { children, ID } = this.props;
    return <div id={ID}>{children}</div>;
  }
}

OnClickListener.propTypes = {
  children: PropTypes.element,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.element
};

export default OnClickListener;
