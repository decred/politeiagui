import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Message } from "pi-ui";
import VerifyTotp from "src/containers/User/Totp/Verify";
import { TOTP_CODE_LENGTH } from "src/constants";

const ModalTotpVerifyContent = ({ onClose, onVerify }) => {
  const [error, setError] = useState();
  const handleChange = (v) => {
    if (v.length === TOTP_CODE_LENGTH) {
      onVerify(v)
        .then(() => {
          onClose();
        })
        .catch((e) => {
          setError(e);
        });
    }
  };
  return (
    <div>
      {error && (
        <Message
          kind="error"
          data-testid="modal-totp-verify-error"
          className="margin-bottom-m">
          {error.toString()}
        </Message>
      )}
      <VerifyTotp
        onType={handleChange}
        extended={false}
        tabIndex={1}
        title="Authenticator Code"
      />
    </div>
  );
};

const ModalTotpVerify = ({ show, onClose, onVerify }) => (
  <Modal show={show} onClose={onClose} title="Verify 2FA Code">
    <ModalTotpVerifyContent onVerify={onVerify} onClose={onClose} />
  </Modal>
);

ModalTotpVerify.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired
};

export default ModalTotpVerify;
