import React from "react";

const CancelButton = ({ onClick, text }) => (
  <button
    className="btn"
    onClick={onClick}
  >
    {text}
  </button>
);

const SubmitButton = ({ onClick, text }) => (
  <button
    className="btn"
    onClick={onClick}
  >
    {text}
  </button>
);

const ModalContentWrapper = ({
  onClose,
  onCancel,
  onSubmit,
  title,
  submitText = "OK",
  cancelText = "Cancel",
  children,
  style
}) => {
  return (
    <div className="modal-content" style={{ minWidth: "700px", ...style }}>
      <div className="modal-content-header">
        <h2 style={{ fontSize: "18px" }} >{title}</h2>
        <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
          {onClose && <span style={{ fontSize: "18px", cursor: "pointer" }} onClick={onClose}>✖</span>}
        </div>
      </div>
      {children}
      {(onCancel || onSubmit) && <div className="modal-content-actions">
        {onCancel && <CancelButton onClick={onCancel} text={cancelText} />}
        {onSubmit && <SubmitButton onClick={onSubmit} text={submitText} />}
      </div>}
    </div>
  );
};

export default ModalContentWrapper;
