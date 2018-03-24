import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import connector from "../../../connectors/modal";

class ConfirmAction extends React.Component {
  render() {
    return(
      <ModalContentWrapper
        title={"Confirm Action"}
        onClose={this.props.closeModal}
        onSubmit={() => console.log("submited")}
      >
        <span>Do you confirm this action?</span>
      </ModalContentWrapper>
    );
  }
}

export default connector(ConfirmAction);
