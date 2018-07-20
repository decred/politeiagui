import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import connector from "../../../connectors/modal";
import MardownEditor from "../../MarkdownEditor";

class ConfirmCensor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      reason: ""
    };
  }
  handleCancel = () => {
    if(this.props.me.callback) {
      this.props.me.callback(false);
    }
    this.props.closeModal();
  }
  handleConfirm = () => {
    const { reason } = this.state;
    this.props.me.callback(reason);
    this.props.closeModal();
  }
  render() {
    return (
      <ModalContentWrapper
        title={"Confirm proposal censor"}
        submitText="Censor proposal"
        cancelText="Cancel"
        onCancel={this.handleCancel}
        onSubmit={this.handleConfirm}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10px 8px",
          minHeight: "80px",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "16px" }}>{"Why are you censoring this proposal?"}</span>
          <MardownEditor
            style={{ width: "100%" }}
            toggledStyle
            onChange={v => this.setState({ reason: v })}
            value={this.state.reason}
          />
        </div>
      </ModalContentWrapper>
    );
  }
}

export default connector(ConfirmCensor);
