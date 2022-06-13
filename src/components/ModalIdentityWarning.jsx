import { Button, Modal, P } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";

const ModalIdentityWarning = ({
  title,
  onClose,
  show,
  onConfirm,
  confirmMessage,
  isCms
}) => (
  <Modal
    style={{ maxWidth: "70rem" }}
    show={show}
    title={title}
    onClose={onClose}
    iconType="info"
    iconSize="lg"
  >
    {!isCms ? (
      <P>
        Politeia will send you a link to verify your email address. You must
        open this link in the same browser. After verifying your email, Politeia
        will create your Politeia “identity”, which consists of a public/private
        cryptographic key pair and browser cookie. This is necessary to verify
        your identity and allow submission of proposals, commenting, voting, and
        other Politeia functions. After completing the signup process, you can
        export your identity (public/private keys) to another browser at any
        time.
      </P>
    ) : (
      <P>
        CMS will create your CMS “identity”, which consists of a public/private
        cryptographic key pair and browser cookie. This is necessary to verify
        your identity and allow submission of invoices, DCCs, commenting, and
        other CMS functions. After completing the signup process, you can export
        your identity (public/private keys) to another browser at any time.
      </P>
    )}
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
  confirmMessage: PropTypes.string,
  isCms: PropTypes.bool
};

ModalIdentityWarning.defaultProps = {
  title: "Before you continue",
  confirmMessage: "I understand, continue"
};

export default ModalIdentityWarning;
