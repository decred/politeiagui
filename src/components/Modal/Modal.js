import React from "react";
import PropTypes from "prop-types";
import OnClickListener from "../OnClickListener";
import OnKeyListener from "../OnKeyListener";

const ESC_KEY = 27;

class Modal extends React.Component {
  render() {
    const {
      onClose,
      onCancel,
      disableCloseOnEsc,
      disableCloseOnClick,
      children,
      style
    } = this.props;
    return (
      <div>
        <OnKeyListener
          keyCode={ESC_KEY}
          onKeyPress={onClose || onCancel}
          disabled={disableCloseOnEsc}
        />
        <OnClickListener
          onClick={onClose || onCancel}
          disabled={disableCloseOnClick}
        />
        <div className="modal">
          <div className="modal-overlay" />
          <div className="modal-container" style={style}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  disableCloseOnClick: PropTypes.bool,
  disableCloseOnEsc: PropTypes.bool,
  children: PropTypes.object,
  style: PropTypes.object
};

export default Modal;
