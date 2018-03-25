import React from "react";

const CancelButton = ({ onClick }) => (
  <button
    className="btn"
    onClick={onClick}
  >
    Cancel
  </button>
);

const SubmitButton = ({ onClick }) => (
  <button
    className="btn"
    onClick={onClick}
  >
    Ok
  </button>
);

const ModalContentWrapper = ({ onClose, onCancel, onSubmit, title, children }) => {
  return (
    <div className="modal-content" style={{ minWidth: "700px" }}>
      <div className="modal-content-header">
        <h2 style={{ fontSize: "18px" }} >{title}</h2>
        <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
          {onClose && <span style={{ fontSize: "18px", cursor: "pointer" }} onClick={onClose}>✖</span>}
        </div>
      </div>
      {children}
      <div className="modal-content-actions">
        {onCancel && <CancelButton onClick={onCancel} />}
        {onSubmit && <SubmitButton onClick={onSubmit} />}
      </div>
    </div>
  );
};

export default ModalContentWrapper;
