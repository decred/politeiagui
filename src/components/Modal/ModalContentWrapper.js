import React from "react";

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

const ModalContentWrapper = ({
  onClose,
  onCancel,
  onSubmit,
  submitDisabled = false,
  title,
  submitText = "OK",
  cancelText = "Cancel",
  children,
  style
}) => {
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
};

export default ModalContentWrapper;
