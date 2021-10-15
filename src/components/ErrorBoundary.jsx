import React, { Component } from "react";
import PropTypes from "prop-types";
import { Message } from "pi-ui";

const defaulErrorRenderer = (error, title) => (
  <Message title={title} header={title} kind="error">
    {error.toString()}
  </Message>
);

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error: error
    };
  }

  render() {
    const { title, errorRenderer, displayError } = this.props;
    const { error } = this.state;
    return error && displayError
      ? errorRenderer(error, title)
      : this.props.children;
  }
}

ErrorBoundary.propTypes = {
  title: PropTypes.string,
  errorRenderer: PropTypes.func,
  displayError: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  title: "Error",
  errorRenderer: defaulErrorRenderer,
  displayError: true
};

export default ErrorBoundary;
