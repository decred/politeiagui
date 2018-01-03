import React, { Component } from "react";
import {autobind} from "core-decorators";
import SignupNextPage from "./SignupNextStepPage";

class SignupNextStepPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      modalIsHidden: false
    };
  }

  render() {
    const {modalIsHidden} = this.state;
    const {onCloseModal, onOpenModal} = this;

    return (
      <SignupNextPage {...{
        modalIsHidden,
        onCloseModal,
        onOpenModal,
      }}/>
    );
  }

  onCloseModal() {
    this.setState({modalIsHidden: true});
  }

  onOpenModal() {
    this.setState({modalIsHidden: false});
  }
}

autobind(SignupNextStepPage);

export default SignupNextStepPage;
