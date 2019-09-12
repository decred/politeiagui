import React from "react";
import { Modal, Button, P } from "pi-ui";
import styles from "./ModalOnboard.module.css";

const ModalOnboard = ({ show, onClose }) => {
  function goToDocs() {
    var win = window.open(
      "https://docs.decred.org/governance/politeia/overview/",
      "_blank"
    );
    win.focus();
    onClose();
  }
  return (
    <Modal show={show} onClose={onClose} title={"Welcome to Politeia!"}>
      <P>
        Are you new to Politeia? Would you like to read more on how all of this
        works?
      </P>
      <P className={styles.extraText}>
        The following information can be reviewed by clicking “Learn More about
        Politiea” in the sidebar.
      </P>
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
