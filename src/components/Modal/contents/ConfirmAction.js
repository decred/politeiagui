import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import connector from "../../../connectors/modal";

class ConfirmAction extends React.Component {
  handleCancel = () => {
    if(this.props.me.callback) {
      this.props.me.callback(false);
    }
    this.props.closeModal();
  }
  handleConfirm = () => {
    if(this.props.me.callback) {
      this.props.me.callback(true);
    }
    this.props.closeModal();
  }
  render() {
    const { me } = this.props;
    return (
      <ModalContentWrapper
        title={me.payload.title || "Confirm Action"}
        submitText="Yes"
        cancelText="No"
        onCancel={this.handleCancel}
        onSubmit={this.handleConfirm}
      >
        <div style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px 8px",
          minHeight: "80px",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "16px", textAlign: "center" }}>{me.payload.message ||  "Do you confirm this action?"}</span>
        </div>
      </ModalContentWrapper>
    );
  }
}

export default connector(ConfirmAction);
