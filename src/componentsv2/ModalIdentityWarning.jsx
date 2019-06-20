import React from "react";
import PropTypes from "prop-types";
import { Modal, P, Button } from "pi-ui";

const ModalIdentityWarning = ({ title, onClose, show, onConfirm, confirmMessage }) => (
  <Modal show={show} title={title} onClose={onClose}>
    <P>
      Politeia will send you a link to verify your email address. You must open
      this link in the same browser. After verifying your email, Politeia will
      create your Politeia “identity”, which consists of a public/private
      cryptographic key pair and browser cookie. This is necessary to verify
      your identity and allow submission of proposals, commenting, voting, and
      other Politeia functions. After completing the signup process, you can
      export your identity (public/private keys) to another browser at any time.
    </P>
    <Button
      style={{
        float: "right",
        marginTop: "3rem"
      }}
      onClick={onConfirm}
    >
      {confirmMessage}
    </Button>
  </Modal>
);

ModalIdentityWarning.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    confirmMessage: PropTypes.string
}

ModalIdentityWarning.defaultProps = {
    title: "Before you continue",
    confirmMessage: "I understand, continue"
};

export default ModalIdentityWarning;
