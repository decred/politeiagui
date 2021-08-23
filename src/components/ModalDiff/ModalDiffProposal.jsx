import React from "react";
import { Modal } from "pi-ui";
import PropTypes from "prop-types";
import DiffProposal from "./DiffProposal";
import styles from "./ModalDiff.module.css";

const ModalDiffProposal = ({
  onClose,
  latest,
  initVersion,
  token,
  ...props
}) => {
  return (
    <Modal onClose={onClose} contentClassName={styles.modalContent} {...props}>
      <DiffProposal
        latest={latest}
        initVersion={initVersion}
        token={token}
        {...props}
      />
    </Modal>
  );
};
ModalDiffProposal.propTypes = {
  onClose: PropTypes.func.isRequired,
  latest: PropTypes.number.isRequired,
  initVersion: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired
};

export default ModalDiffProposal;
