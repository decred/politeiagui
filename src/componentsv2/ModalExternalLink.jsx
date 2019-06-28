import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, P, Text, Message } from "pi-ui";
import { Row } from "./layout";

const ModalExternalLink = ({ show, onClose, link }) => {
  const tmpLink = document.createElement("a");
  tmpLink.href = link;
  function onProceed() {
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location.href = link;
    newWindow.target = "_blank";
    onClose();
  }
  return (
    <Modal show={show} onClose={onClose} title="Warning: Leaving Politeia">
      <Message kind="warning">
        <P>
          {" "}
          You are about to be sent to an external website. This can result in
          unintended consequences.
          <strong> DO NOT</strong> enter your Politeia credentials or reveal any
          other sensitive information.
        </P>
      </Message>
      <div className="margin-top-s">
        <Text className="margin-top-s" weight="bold">
          External link:
        </Text>
        <div
          className="margin-top-xs"
          style={{
            display: "inline-block",
            border: "1px solid #dcdcdc",
            padding: ".5em",
            borderRadius: "6px",
            background: "#dcdcdc5c",
            width: "100%"
          }}
        >
          <Text>{tmpLink.protocol + "//"}</Text>
          <Text color="orange">{tmpLink.hostname}</Text>
          <Text>{tmpLink.pathname + tmpLink.search + tmpLink.hash}</Text>
        </div>
      </div>
      <Row topMarginSize="m" justify="center">
        <Text weight="semibold">Are you sure you want to open this link?</Text>
      </Row>
      <Row topMarginSize="s" justify="right">
        <Button className="margin-top-s" onClick={onProceed}>
          Yes, proceed
        </Button>
      </Row>
    </Modal>
  );
};

ModalExternalLink.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  link: PropTypes.string
};

export default ModalExternalLink;
