import { Button, classNames, Modal, Text, useMediaQuery } from "pi-ui";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import PaymentComponent from "../PaymentComponent";
import PaymentStatusTag from "../PaymentStatusTag";
import styles from "./ModalBuyProposalCredits.module.css";

const ModalBuyProposalCredits = ({
  show,
  onClose,
  price,
  initialStep = 0,
  address,
  isPaid,
  status,
  isPollingCreditsPayment,
  startPollingPayment
}) => {
  const [number, setNumber] = useState(1);
  const customOnClose = () => {
    onClose();
    // Wait the transition finish to change the modal type
    setTimeout(() => setModalType(initialStep), 300);
  };
  const [modalType, setModalType] = useState(initialStep);
  function handleGoToPaymentDetails() {
    setModalType(1);
  }

  useEffect(() => {
    if (!isPollingCreditsPayment) startPollingPayment();
  }, [isPollingCreditsPayment, startPollingPayment]);

  const setValue = e => {
    if (e.target.value < 1) return;
    setNumber(e.target.value);
  };
  const extraSmall = useMediaQuery("(max-width: 560px)");
  return modalType ? (
    <Modal show={show} onClose={customOnClose} title="Complete your purchase">
      {extraSmall && <PaymentStatusTag status={status} />}
      <PaymentComponent
        address={address}
        amount={(number * price).toFixed(1)}
        extraSmall={extraSmall}
        isPaid={isPaid}
        status={status}
      />
    </Modal>
  ) : (
      <Modal
        show={show}
        onClose={customOnClose}
        title="Purchase Proposal Credits"
        contentStyle={{ width: "100%" }}
      >
        <div>
          <Text>How many credits do you want to buy? </Text>
          <input
            value={number}
            onChange={setValue}
            type="number"
            style={{ width: "40px" }}
          />
        </div>
        <div className="margin-top-s">
          <Text color="gray">Each proposal credit costs 0.1 DCR</Text>
        </div>
        <div className={classNames("margin-top-l", styles.actionButtons)}>
          <Button onClick={customOnClose} kind="secondary">
            Back
        </Button>
          <Button kind="primary" onClick={handleGoToPaymentDetails}>
            Next
        </Button>
        </div>
      </Modal>
    );
};

ModalBuyProposalCredits.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default ModalBuyProposalCredits;
