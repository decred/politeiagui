import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import Message from "../../Message";
import modalConnector from "../../../connectors/modal";

class ConfirmActionWithReason extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      reason: ""
    };
  }

  componentDidMount() {
    this.textAreaRef.focus();
  }

  handleChange = event => {
    this.setState({ reason: event.target.value });
  };

  handleCancel = () => {
    if (this.props.me.callback) {
      this.props.me.callback({ confirm: false });
    }
    this.props.closeModal();
  };

  handleConfirm = () => {
    const reason = (this.state.reason || "").trim();
    if (reason.length === 0) {
      this.setState({ error: "You must provide a reason for this action." });
      return;
    }

    if (this.props.me.callback) {
      this.props.me.callback({
        confirm: true,
        reason
      });
    }
    this.props.closeModal();
  };

  render() {
    const { me } = this.props;
    return (
      <ModalContentWrapper
        title={me.payload.title || "Confirm Action"}
        submitText="Submit"
        cancelText="Cancel"
        onCancel={this.handleCancel}
        onSubmit={this.handleConfirm}
      >
        {this.state.error && (
          <Message type="error" title="Error" body={this.state.error} />
        )}
        <div style={{ width: "90%" }}>
          <textarea
            className="modal-reason"
            placeholder={
              me.payload.reasonPlaceholder ||
              "Please provide a reason for this action"
            }
            ref={ref => (this.textAreaRef = ref)}
            value={this.state.reason}
            onChange={this.handleChange}
          />
        </div>
      </ModalContentWrapper>
    );
  }
}

export default modalConnector(ConfirmActionWithReason);
