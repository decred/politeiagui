import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import loginModalConnector from "../../../connectors/loginModal";
import { LoginForm, Link } from "../../snew";

class Login extends React.Component {
  handleClose = () => {
    this.props.resetRedirectFrom();
    this.props.closeModal();
  };

  componentDidMount() {
    const {
      me: { payload }
    } = this.props;
    const redirectAfterLogin = payload && payload.redirectAfterLogin;
    // the redirectedFrom prop tells to where the user should be redirected to after login
    // if redirectAfterLogin prop is specified it will be the destination
    // otherwise the destination will be the same path as where the modal was opened from
    const redirectPath = redirectAfterLogin || this.props.pathname;
    this.props.redirectedFrom(redirectPath);
  }

  render() {
    const {
      me: { payload },
      closeModal
    } = this.props;
    const title =
      payload.title || "You must be logged in to perform this action";
    return (
      <ModalContentWrapper
        title={title}
        cancelText="Close"
        onClose={this.handleClose}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 8px",
            minHeight: "360px",
            alignItems: "center"
          }}
        >
          <div style={{ width: "320px" }}>
            <div style={{ marginBottom: "34px" }}>
              <h1 style={{ margin: "0px" }}>Login</h1>
              or{" "}
              <Link
                onClick={closeModal}
                href="/user/signup"
                className="login-required"
              >
                create an account
              </Link>
            </div>
            <LoginForm style={{ marginTop: "10px" }} {...this.props} />
          </div>
        </div>
      </ModalContentWrapper>
    );
  }
}

export default loginModalConnector(modalConnector(Login));
