import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SingleContentPage from "./layout/SingleContentPage";
import IdentityMessageError from "./IdentityMessageError";
import { IDENTITY_ERROR } from "src/constants";

const identityErrorRenderer = (history) => (
  <SingleContentPage noCardWrap>
    <IdentityMessageError />
  </SingleContentPage>
);

class IdentityErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error
    };
  }

  render() {
    const { history } = this.props;
    // If user navigates away reset error.
    history.listen(() => {
      if (this.state.error) {
        this.setState({
          error: false
        });
      }
    });
    const { error } = this.state;
    const isIdentityError = error?.message === IDENTITY_ERROR;
    return isIdentityError
      ? identityErrorRenderer(error, history)
      : this.props.children;
  }
}

export default withRouter(IdentityErrorBoundary);
