import React, { Component } from "react";
import { Button } from "pi-ui";
import { withRouter } from "react-router-dom";
import SingleContentPage from "./layout/SingleContentPage";
import IdentityMessageError from "./IdentityMessageError";
import { isIdentityError } from "src/utils";
import { Row } from "./layout";

const identityErrorRenderer = (history) => (
  <SingleContentPage noCardWrap>
    <IdentityMessageError />
    <Row justify="center">
      <Button onClick={() => history.push("/")}>Return home</Button>
    </Row>
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
    return isIdentityError(error)
      ? identityErrorRenderer(history)
      : this.props.children;
  }
}

export default withRouter(IdentityErrorBoundary);
