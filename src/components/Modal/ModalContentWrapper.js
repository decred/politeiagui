import React from "react";
import PropTypes from "prop-types";
import { uniqueID } from "../../helpers";

const CancelButton = ({ onClick, text }) => (
  <button
    className="btn"
    onClick={onClick}
  >
    {text}
  </button>
);

const SubmitButton = ({ onClick, text, disabled }) => (
  <button
    className={`btn ${disabled ? "not-active disabled" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </button>
);

class ModalContentWrapper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalID: uniqueID("modal")
    };
  }
  handleKeyUp = (e) => {
    const ESC_KEY = 27;
    const pressedEscKey = e.keyCode === ESC_KEY && !this.props.disableCloseOnEsc;
    const action = this.props.onClose || this.props.onCancel;
    if(pressedEscKey && action)
      action();
  }
  focusFirstInputOnModal = () => {
    const modal = document.getElementById(this.state.modalID);
    const inputs = modal && modal.querySelectorAll("input");
    if (inputs && inputs.length) {
      inputs[0].focus();
    }
  }
  componentWillMount(){
    window.addEventListener("keyup", this.handleKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }
  componentDidMount() {
    this.focusFirstInputOnModal();
  }
  render() {
    const {
      onClose,
      onCancel,
      onSubmit,
      submitDisabled = false,
      title,
      submitText = "OK",
      cancelText = "Cancel",
      children,
      style
    } = this.props;

    return (
      <div id={this.state.modalID} className="modal-content" style={{ minWidth: "700px", ...style }}>
        <div className="modal-content-header">
          <h2 style={{ fontSize: "18px", textTransform: "uppercase" }} >{title}</h2>
          <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            {onClose && <span style={{ fontSize: "18px", cursor: "pointer" }} onClick={onClose}>✖</span>}
          </div>
        </div>
        {children}
        {(onCancel || onSubmit) && <div className="modal-content-actions">
          {onCancel && <CancelButton onClick={onCancel} text={cancelText} />}
          {onSubmit && <SubmitButton onClick={onSubmit} text={submitText} disabled={submitDisabled} />}
        </div>}
      </div>
    );
  }
}

ModalContentWrapper.propTypes = {
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitDisabled: PropTypes.bool,
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]),
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  style: PropTypes.object,
  disableCloseOnEsc: PropTypes.bool
};

export default ModalContentWrapper;
