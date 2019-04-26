import React, { Component } from "react";
import Message from "./Message";

export default class ErrorBoundary extends Component {
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
    const { title } = this.props;
    const { error } = this.state;
    return error ? (
      <Message header={title} type="error" body={error.toString()} />
    ) : (
      this.props.children
    );
  }
}
