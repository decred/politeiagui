import React from "react";
import { Card, Modal } from "pi-ui";
import { MarkdownDiffHTML } from "@politeiagui/common-ui";

function ModalProposalDiff({ oldBody, show, newBody, onClose }) {
  return (
    <Modal show={show} onClose={onClose}>
      <Card paddingSize="small">
        <MarkdownDiffHTML oldText={oldBody} newText={newBody} />
      </Card>
    </Modal>
  );
}

export default ModalProposalDiff;
