import {
  Button,
  classNames,
  Modal,
  Text,
  useMediaQuery,
  NumberInput
} from "pi-ui";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import FormWrapper from "src/components/FormWrapper";
import PaymentComponent from "../PaymentComponent";
import PaymentStatusTag from "../PaymentStatusTag";
import styles from "./ModalBuyProposalCredits.module.css";
import { validationSchema } from "./validation";
import useProposalCreditsPaymentInfo from "./hooks";

const ModalBuyProposalCredits = ({
  show,
  onClose,
  price,
  initialStep = 0,
  address,
  userID,
  startPollingPayment
}) => {
  const [creditsNumber, setNumber] = useState(1);
  const customOnClose = () => {
    onClose();
    // Wait the transition finish to change the modal type
    setTimeout(() => setModalType(initialStep), 300);
  };
  const [modalType, setModalType] = useState(initialStep);
  function handleGoToPaymentDetails(values) {
    setModalType(1);
    setNumber(+values.creditsNumber);
  }

  const { isPollingCreditsPayment, status, amount } =
    useProposalCreditsPaymentInfo(userID);

  useEffect(() => {
    setModalType(initialStep);
  }, [initialStep]);

  useEffect(() => {
    if (!isPollingCreditsPayment && modalType === 1) {
      startPollingPayment();
    }
  }, [isPollingCreditsPayment, startPollingPayment, modalType]);

  const extraSmall = useMediaQuery("(max-width: 560px)");
  return modalType ? (
    <Modal show={show} onClose={customOnClose} title="Complete your purchase">
      {extraSmall && <PaymentStatusTag status={status} />}
      <PaymentComponent
        address={address}
        amount={amount || +(creditsNumber * price).toFixed(1)}
        extraSmall={extraSmall}
        status={status}
      />
    </Modal>
  ) : (
    <Modal
      show={show}
      onClose={customOnClose}
      title="Purchase Proposal Credits"
      contentStyle={{ width: "100%" }}>
      <FormWrapper
        initialValues={{
          creditsNumber: "1"
        }}
        validationSchema={validationSchema}
        onSubmit={handleGoToPaymentDetails}>
        {({
          Form,
          ErrorMessage,
          values,
          handleChange,
          handleSubmit,
          errors
        }) => {
          const disableNext =
            (errors && errors.creditsNumber) || !+values.creditsNumber;
          return (
            <Form onSubmit={handleSubmit}>
              <div>
                <Text>How many credits do you want to buy? </Text>
                <NumberInput
                  id="creditsNumber"
                  name="creditsNumber"
                  value={values.creditsNumber}
                  onChange={handleChange}
                />
                {errors && errors.creditsNumber && (
                  <ErrorMessage>{errors.creditsNumber}</ErrorMessage>
                )}
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
                  type="submit">
                  Next
                </Button>
              </div>
            </Form>
          );
        }}
      </FormWrapper>
    </Modal>
  );
};

ModalBuyProposalCredits.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default ModalBuyProposalCredits;
