import React from "react";
import PropTypes from "prop-types";

const CancelButton = ({ onClick, text }) => (
  <button className="btn" onClick={onClick}>
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
          <h2 style={{ fontSize: "18px", textTransform: "uppercase" }}>
            {title}
          </h2>
          <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            <span
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={onClose}
            >
              ✖
            </span>
          </div>
        </div>
        {children}
        {(onCancel || onSubmit) && (
          <div className="modal-content-actions">
            {onCancel && <CancelButton onClick={onCancel} text={cancelText} />}
            {onSubmit && (
              <SubmitButton
                onClick={onSubmit}
                text={submitText}
                disabled={submitDisabled}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

ModalContentWrapper.propTypes = {
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  style: PropTypes.object,
  submitDisabled: PropTypes.bool,
  submitText: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default ModalContentWrapper;
