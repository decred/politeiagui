import React from "react";
import PropTypes from "prop-types";

class OnClickListener extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicks: 0
    };
  }

  handleOnClick = event => {
    const { clicks } = this.state;
    const { disabled } = this.props;
    this.setState({ clicks: clicks + 1 });
    if (!event.target.closest(".modal-content") && clicks > 0 && !disabled) {
      this.props.onClick();
    }
  };

  componentDidMount() {
    window.addEventListener("click", this.handleOnClick);
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
  onClick: PropTypes.func
};

OnClickListener.defaultProps = {
  disabled: false
};

export default OnClickListener;
