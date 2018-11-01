import React from "react";
import PropTypes from "prop-types";

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
  handleKeyUp = (e) => {
    if (e.keyCode === 27 && !this.props.disableCloseOnEsc) {
      if(this.props.onClose) {
        this.props.onClose();
      } else if(this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }
  componentWillMount(){
    window.addEventListener("keyup", this.handleKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
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
      <div className="modal-content" style={{ minWidth: "700px", ...style }}>
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
