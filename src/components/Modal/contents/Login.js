import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import loginModalConnector from "../../../connectors/loginModal";
import { LoginSignupPage } from "../../snew";

class Login extends React.Component {
handleCancel = () => {
  this.props.closeModal();
};
componentDidMount() {
  this.props.redirectedFrom(this.props.pathname);
}
render() {
  return (
    <ModalContentWrapper
      title={"You must be logged in to perform this action"}
      cancelText="Close"
      onCancel={this.handleCancel}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 8px",
          minHeight: "80px",
          alignItems: "center"
        }}
      >
        <LoginSignupPage {...this.props} />
      </div>
    </ModalContentWrapper>
  );
}
}

export default loginModalConnector(modalConnector(Login));
