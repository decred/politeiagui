import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import { PI_DOCS } from "../../../constants";

class WelcomeModal extends React.Component {
  openInNewTab = url => {
    const win = window.open(url, "_blank");
    win.focus();
  };
  handleCancel = () => {
    if (this.props.me.callback) {
      this.props.me.callback(false);
    }
    this.props.closeModal();
  };
  handleConfirm = () => {
    if (this.props.me.callback) {
      this.props.me.callback(true);
    }
    this.props.closeModal() && this.openInNewTab(PI_DOCS);
  };
  render() {
    return (
      <ModalContentWrapper
        title={"Welcome to Politeia!"}
        submitText={"Yes, show me more"}
        cancelText={"Maybe later"}
        onCancel={this.handleCancel}
        onSubmit={this.handleConfirm}
      >
        <div style={{ display: "grid", padding: "1em", fontSize: "1.15em" }}>
          <strong
            style={{
              textAlign: "center",
              fontSize: "1.05em",
              marginBottom: "1em",
              fontWeight: "1.2em"
            }}
          >
            Are you new to Politeia? Would you like to read more on how all of
            this works?
          </strong>
          <span
            style={{
              textAlign: "center",
              marginTop: ".5em",
              fontStyle: "italic"
            }}
          >
            The following information can be reviewed by clicking 'Learn More
            about Politiea' in the sidebar.
          </span>
        </div>
      </ModalContentWrapper>
    );
  }
}

export default modalConnector(WelcomeModal);
