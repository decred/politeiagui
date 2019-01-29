import React from "react";
import OnKeyListener from "../OnKeyListener";
import PropTypes from "prop-types";
import { uniqueID } from "../../helpers";
import OnClickListener from "../OnClickListener";

const ESC_KEY = 27;
const modalID = uniqueID("modal");

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
  focusFirstInputOnModal = () => {
    const modal = document.getElementById(modalID);
    const inputs = modal && modal.querySelectorAll("input");
    if (inputs && inputs.length) {
      inputs[0].focus();
    }
  };
  componentDidMount() {
    this.focusFirstInputOnModal();
  }
  render() {
    const {
      onClose,
      onCancel,
      onSubmit,
      disableCloseOnEsc,
      disableCloseOnClick,
      submitDisabled = false,
      title,
      submitText = "OK",
      cancelText = "Cancel",
      children,
      style
    } = this.props;
    return (
      <OnKeyListener
        ID={modalID}
        keyCode={ESC_KEY}
        onKeyPress={onClose || onCancel}
        disabled={disableCloseOnEsc}
      >
        <OnClickListener
          ID={modalID}
          onClick={onClose || onCancel}
          disabled={disableCloseOnClick}
        >
          <div
            className="modal-content"
            style={{ minWidth: "700px", ...style }}
          >
            <div className="modal-content-header">
              <h2 style={{ fontSize: "18px", textTransform: "uppercase" }}>
                {title}
              </h2>
              <div
                style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}
              >
                {onClose && (
                  <span
                    style={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={onClose}
                  >
                    ✖
                  </span>
                )}
              </div>
            </div>
            {children}
            {(onCancel || onSubmit) && (
              <div className="modal-content-actions">
                {onCancel && (
                  <CancelButton onClick={onCancel} text={cancelText} />
                )}
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
        </OnClickListener>
      </OnKeyListener>
    );
  }
}

ModalContentWrapper.propTypes = {
  cancelText: PropTypes.string,
  disableCloseOnEsc: PropTypes.bool,
  disableCloseOnClick: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  style: PropTypes.object,
  submitDisabled: PropTypes.bool,
  submitText: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};

export default ModalContentWrapper;
