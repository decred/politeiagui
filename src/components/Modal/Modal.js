import React from "react";
import PropTypes from "prop-types";
import OnKeyListener from "../OnKeyListener";

const ESC_CODE = 27;

const Modal = props => {
  return (
    <OnKeyListener keyCode={ESC_CODE} onKeyPress={props.onClose}>
      <div className="modal">
        <div className="modal-overlay" />
        <div className="modal-container" style={props.style}>
          {props.children}
        </div>
      </div>
    </OnKeyListener>
  );
};

Modal.prototypes = {
  onClose: PropTypes.func
};

export default Modal;
