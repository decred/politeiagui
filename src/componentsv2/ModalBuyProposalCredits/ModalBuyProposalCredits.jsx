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
  status,
  isPollingCreditsPayment,
  startPollingPayment
}) => {
  const [number, setNumber] = useState(1);
  const [disableNext, setDisableNext] = useState(false);
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
    if (!isPollingCreditsPayment && modalType === 1) startPollingPayment();
  }, [isPollingCreditsPayment, startPollingPayment, modalType]);

  const setValue = e => {
    if (e.target.value === "") {
      setDisableNext(true);
      setNumber(e.target.value);
      return;
    }
    if (e.target.value <= 0) {
      setDisableNext(true);
      setNumber(0);
    } else {
      setDisableNext(false);
      setNumber(e.target.value);
    }
  };
  const extraSmall = useMediaQuery("(max-width: 560px)");
  return modalType ? (
    <Modal show={show} onClose={customOnClose} title="Complete your purchase">
      {extraSmall && <PaymentStatusTag status={status} />}
      <PaymentComponent
        address={address}
        amount={+(number * price).toFixed(1)}
        extraSmall={extraSmall}
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
          className={styles.inputNumber}
        />
      </div>
      <div className="margin-top-s">
        <Text color="gray">Each proposal credit costs 0.1 DCR</Text>
      </div>
      <div className={classNames("margin-top-l", styles.actionButtons)}>
        <Button onClick={customOnClose} kind="secondary">
          Back
        </Button>
        <Button
          kind={(disableNext && "disabled") || "primary"}
          onClick={handleGoToPaymentDetails}
        >
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
