import React from "react";
import { Modal, Button } from "pi-ui";
import StaticMarkdown from "src/componentsv2/StaticMarkdown";
import { useConfig } from "src/containers/Config";

const ModalOnboard = ({ show, onClose }) => {
  const { onBoardContent, onBoardLink } = useConfig();
  function goToDocs() {
    const win = window.open(
      onBoardLink,
      "_blank",
      "noopener=true,noreferrer=true"
    );
    win.focus();
    onClose();
  }
  return (
    <Modal show={show} onClose={onClose}>
      <StaticMarkdown contentName={onBoardContent} />
      <div className="justify-right margin-top-l">
        <Button kind="secondary" onClick={onClose}>
          Maybe later
        </Button>
        <Button onClick={goToDocs}>Yes, show me more</Button>
      </div>
    </Modal>
  );
};

export default ModalOnboard;
